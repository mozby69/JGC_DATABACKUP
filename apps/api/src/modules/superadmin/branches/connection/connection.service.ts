import { createSftpConnection } from "../../../../lib/sftp/sftp.client";
import { findBranchByIdRepo } from "../branch.repository";

function getConnectionConfig(branch: {
  ipAddress: string;
  sshPort: number;
  sshUsername: string;
  branchCode: string;
}) {
  return {
    host: branch.ipAddress,
    port: branch.sshPort,
    username: branch.sshUsername,

    // Private keys are provisioned manually, one file per branch code.
    keyName: branch.branchCode,
  };
}

export async function testBranchConnectionService(
  branchId: number
) {
  const branch = await findBranchByIdRepo(branchId);

  if (!branch) {
    throw new Error("Branch not found");
  }

  if (!branch.isActive) {
    throw new Error("Branch is inactive");
  }

  const client = await createSftpConnection(
    getConnectionConfig(branch)
  );

  try {
    const exists = await client.exists(branch.backupFolder);

    if (exists !== "d") {
      throw new Error(
        "Connected successfully, but backup folder is not accessible"
      );
    }

    await client.list(branch.backupFolder);

    return {
      branchId: branch.id,
      branchName: branch.branchName,
      connected: true,
      backupFolder: branch.backupFolder,
      message: "SFTP connection successful",
    };
  } finally {
    await client.end();
  }
}

export async function getBranchFilesService(branchId: number) {
  const branch = await findBranchByIdRepo(branchId);

  if (!branch) {
    throw new Error("Branch not found");
  }

  if (!branch.isActive) {
    throw new Error("Branch is inactive");
  }

  const client = await createSftpConnection(
    getConnectionConfig(branch)
  );

  try {
    const files = await client.list(branch.backupFolder);

    return {
      branchId: branch.id,
      branchName: branch.branchName,
      backupFolder: branch.backupFolder,

      files: files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        modifyTime: file.modifyTime,
      })),
    };
  } finally {
    await client.end();
  }
}

