import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import express from "express";
import { type Server } from "node:http";
import { access } from "node:fs/promises";
import { type AddressInfo } from "node:net";
const mocks = vi.hoisted(() => ({
  uploadBranch: vi.fn(),
  uploadBackup: vi.fn(),
}));
vi.mock("./backup.service", () => mocks);
vi.mock("./backup.repository", () => ({}));
// Keep real authorization and multipart handling; replace only cookie verification.
vi.mock("@/middleware/authenticate.middleware", () => ({
  authenticate: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const role = req.header("x-test-role");
    if (!role) return res.status(401).json({ success: false });
    req.user = {
      id: 7,
      name: "User",
      username: "user",
      roles: [role],
      permissions: [],
    };
    next();
  },
}));
import router from "./backup.routes";
import { errorHandler } from "@/middleware/error-handler.middleware";
let server: Server;
let url: string;
beforeAll(async () => {
  const app = express();
  app.use((req, _res, next) => {
    req.log = {
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as express.Request["log"];
    next();
  });
  app.use("/backups", router);
  app.use(errorHandler);
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/backups`;
});
afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
beforeEach(() => {
  vi.clearAllMocks();
  mocks.uploadBranch.mockResolvedValue({ id: 3 });
  mocks.uploadBackup.mockResolvedValue({ backupNo: "BU-TEST" });
});
function multipart(count: number) {
  const form = new FormData();
  form.append("backupDate", "2026-10-26");
  form.append("subject", "Daily files");
  for (let i = 0; i < count; i++)
    form.append("attachments", new Blob([`file-${i}`]), `file-${i}.zip`);
  return form;
}
describe("backup upload routes", () => {
  it("accepts the full ten-file limit and removes staging files after success", async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "x-test-role": "USER" },
      body: multipart(10),
    });
    expect(response.status).toBe(201);
    await response.json();
    const [userId, input, files] = mocks.uploadBackup.mock.calls[0];
    expect(userId).toBe(7);
    expect(input).toEqual({ subject: "Daily files", backupDate: "2026-10-26" });
    expect(files).toHaveLength(10);
    await vi.waitFor(async () => {
      await expect(access(files[0].path)).rejects.toThrow();
    });
  });
  it("rejects excess files before invoking SFTP upload", async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "x-test-role": "USER" },
      body: multipart(11),
    });
    expect(response.status).toBe(400);
    await response.json();
    expect(mocks.uploadBackup).not.toHaveBeenCalled();
  });
  it("rejects client-supplied branch fields", async () => {
    const form = multipart(1);
    form.append("branchId", "99");
    const response = await fetch(url, {
      method: "POST",
      headers: { "x-test-role": "USER" },
      body: form,
    });
    expect(response.status).toBe(400);
    await response.json();
    expect(mocks.uploadBackup).not.toHaveBeenCalled();
  });
  it("requires an authorized role before staging files", async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "x-test-role": "ADMIN" },
      body: multipart(1),
    });
    expect(response.status).toBe(403);
    await response.json();
    expect(mocks.uploadBranch).not.toHaveBeenCalled();
  });
  it("requires authentication", async () => {
    const response = await fetch(url, { method: "POST", body: multipart(1) });
    expect(response.status).toBe(401);
    await response.json();
    expect(mocks.uploadBranch).not.toHaveBeenCalled();
  });
});
