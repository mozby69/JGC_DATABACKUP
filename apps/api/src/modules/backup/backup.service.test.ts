import { beforeEach, describe, expect, it, vi } from "vitest";
import { backupInputSchema } from "@repo/shared";
const mocks = vi.hoisted(() => ({
  repo: {
    findUploadUser: vi.fn(),
    createBackup: vi.fn(),
    updateBackupStatus: vi.fn(),
    publicBackup: vi.fn((value) => value),
    findBackup: vi.fn(),
  },
  client: {
    exists: vi.fn(),
    mkdir: vi.fn(),
    put: vi.fn(),
    stat: vi.fn(),
    rmdir: vi.fn(),
    end: vi.fn(),
    get: vi.fn(),
  },
  connect: vi.fn(),
}));
vi.mock("./backup.repository", () => mocks.repo);
vi.mock("@/lib/sftp/sftp.client", () => ({
  createSftpConnection: mocks.connect,
}));
import {
  accessibleBackup,
  branchKeyName,
  downloadFile,
  uploadBackup,
  uploadBranch,
} from "./backup.service";

const user = {
  id: 2,
  name: "Branch User",
  username: "branch",
  roles: ["USER"],
  permissions: [],
};
const branch = {
  id: 3,
  branchCode: "BR003",
  branchName: "Branch Three",
  ipAddress: "192.0.2.3",
  sshPort: 22,
  sshUsername: "backupuser",
  backupFolder: "C:/BackupData",
  isActive: true,
};
const input = { subject: "Daily DB", backupDate: "2026-10-26" };
const files = [
  { originalname: "../../daily.zip", path: "/tmp/upload-file", size: 12 },
] as Express.Multer.File[];
beforeEach(() => {
  vi.clearAllMocks();
  mocks.repo.findUploadUser.mockResolvedValue({ branch });
  mocks.repo.updateBackupStatus.mockImplementation(async (id, status) => ({
    id,
    status,
  }));
  mocks.connect.mockResolvedValue(mocks.client);
  mocks.client.exists.mockResolvedValue("d");
  mocks.client.stat.mockResolvedValue({ size: 12 });
  for (const name of ["mkdir", "put", "rmdir", "end", "get"] as const)
    mocks.client[name].mockResolvedValue(undefined);
});
describe("branch-scoped SFTP backups", () => {
  it("rejects users without a branch before opening SFTP", async () => {
    mocks.repo.findUploadUser.mockResolvedValue({ branch: null });
    await expect(uploadBranch(user.id)).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(mocks.connect).not.toHaveBeenCalled();
  });
  it("rejects inactive branches", async () => {
    mocks.repo.findUploadUser.mockResolvedValue({
      branch: { ...branch, isActive: false },
    });
    await expect(uploadBackup(user.id, input, files)).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(mocks.repo.createBackup).not.toHaveBeenCalled();
  });
  it("uses the assigned branch and server-generated paths, then verifies transfer size", async () => {
    await uploadBackup(user.id, input, files);
    const saved = mocks.repo.createBackup.mock.calls[0][0];
    expect(saved).toMatchObject({
      branchId: 3,
      uploadedById: 2,
      storageKeyName: "BR003",
      files: { create: [{ originalName: "daily.zip", size: 12n }] },
    });
    expect(saved.remoteDirectory).toMatch(
      /^C:\/BackupData\/2026-10-26\/[a-f0-9-]+$/,
    );
    expect(mocks.connect).toHaveBeenCalledWith({
      host: branch.ipAddress,
      port: 22,
      username: "backupuser",
      keyName: "BR003",
    });
    expect(mocks.client.put.mock.calls[0][1]).not.toContain("daily.zip");
    expect(mocks.repo.updateBackupStatus).toHaveBeenCalledWith(
      saved.id,
      "COMPLETE",
    );
    expect(mocks.client.end).toHaveBeenCalledOnce();
  });
  it("marks size mismatches failed and removes partial remote files", async () => {
    mocks.client.stat.mockResolvedValue({ size: 5 });
    await expect(uploadBackup(user.id, input, files)).rejects.toThrow(
      "Transferred file size mismatch",
    );
    expect(mocks.repo.updateBackupStatus).toHaveBeenCalledWith(
      expect.any(String),
      "FAILED",
    );
    expect(mocks.client.rmdir).toHaveBeenCalledWith(
      expect.stringContaining("C:/BackupData/2026-10-26/"),
      true,
    );
    expect(mocks.client.end).toHaveBeenCalledOnce();
  });
  it("records connection failures as failed", async () => {
    mocks.connect.mockRejectedValueOnce(new Error("Offline"));
    await expect(uploadBackup(user.id, input, files)).rejects.toThrow(
      "Offline",
    );
    expect(mocks.repo.updateBackupStatus).toHaveBeenCalledWith(
      expect.any(String),
      "FAILED",
    );
  });
  it("rejects cross-user access without exposing backup existence", async () => {
    mocks.repo.findBackup.mockResolvedValue({ uploadedById: 9 });
    await expect(accessibleBackup("id", user)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
  it("lets superadmin view another user's backup", async () => {
    mocks.repo.findBackup.mockResolvedValue({ uploadedById: 9 });
    await expect(
      accessibleBackup("id", { ...user, roles: ["SUPER_ADMIN"] }),
    ).resolves.toMatchObject({ uploadedById: 9 });
  });
  it("blocks downloads for incomplete transfers", async () => {
    mocks.repo.findBackup.mockResolvedValue({
      uploadedById: 2,
      status: "FAILED",
    });
    await expect(
      downloadFile("id", "file", user, "/tmp/dest"),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(mocks.connect).not.toHaveBeenCalled();
  });
  it("downloads using the historical connection snapshot and a recorded file ID", async () => {
    mocks.repo.findBackup.mockResolvedValue({
      uploadedById: 2,
      status: "COMPLETE",
      storageHost: "192.0.2.10",
      storagePort: 2222,
      storageUsername: "olduser",
      storageKeyName: "OLD",
      remoteDirectory: "/old/path",
      files: [{ id: "file", originalName: "db.zip", storedName: "opaque-id" }],
    });
    await expect(downloadFile("id", "file", user, "/tmp/dest")).resolves.toBe(
      "db.zip",
    );
    expect(mocks.connect).toHaveBeenCalledWith({
      host: "192.0.2.10",
      port: 2222,
      username: "olduser",
      keyName: "OLD",
    });
    expect(mocks.client.get).toHaveBeenCalledWith(
      "/old/path/opaque-id",
      "/tmp/dest",
    );
  });
  it("rejects SSH key path traversal", () => {
    expect(() => branchKeyName("../../key")).toThrow();
  });
  it("rejects impossible calendar dates", () => {
    expect(
      backupInputSchema.safeParse({ ...input, backupDate: "2026-02-30" })
        .success,
    ).toBe(false);
    expect(backupInputSchema.safeParse(input).success).toBe(true);
  });
});
