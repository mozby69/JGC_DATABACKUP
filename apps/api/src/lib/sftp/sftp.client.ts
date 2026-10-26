import SftpClient from "ssh2-sftp-client";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

export interface SftpConnectionConfig {
  host: string;
  port: number;
  username: string;
  keyName: string;
}

function decodeKnownHostsKey(
  content: string,
  host: string,
  port: number
): Buffer {
  const hostPattern =
    port === 22 ? host : `[${host}]:${port}`;

  const matchingKeys: Buffer[] = [];

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const parts = trimmed.split(/\s+/);

    // Standard known_hosts format:
    // hostnames key-type base64-key
    // Hashed entries require separate handling.
    if (parts.length < 3) continue;

    const [hostnames, keyType, base64Key] = parts;

    if (
      !hostnames.split(",").includes(hostPattern) ||
      !keyType.startsWith("ssh-")
    ) {
      continue;
    }

    matchingKeys.push(Buffer.from(base64Key, "base64"));
  }

  if (matchingKeys.length === 0) {
    throw new Error(
      `No trusted SSH host key found for ${hostPattern}. ` +
      "Verify and register the host key before connecting."
    );
  }

  // This initial implementation supports a single trusted key.
  // Multiple host keys should be handled explicitly.
  return matchingKeys[0];
}

export async function createSftpConnection(
  config: SftpConnectionConfig
): Promise<SftpClient> {
  const keyDirectory = process.env.SFTP_KEY_DIRECTORY;
  const knownHostsPath = process.env.SFTP_KNOWN_HOSTS;

  if (!keyDirectory || !knownHostsPath) {
    throw new Error("SFTP environment configuration is missing");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(config.keyName)) {
    throw new Error("Invalid SSH key name");
  }

  const privateKey = await readFile(
    join(keyDirectory, config.keyName),
    "utf8"
  );

  const knownHosts = await readFile(knownHostsPath, "utf8");

  const trustedHostKey = decodeKnownHostsKey(
    knownHosts,
    config.host,
    config.port
  );

  const trustedFingerprint = createHash("sha256")
    .update(trustedHostKey)
    .digest("hex");

  const client = new SftpClient();

  await client.connect({
    host: config.host,
    port: config.port,
    username: config.username,
    privateKey,

    readyTimeout: 15_000,

    hostVerifier: (serverKey: Buffer) => {
      const serverFingerprint = createHash("sha256")
        .update(serverKey)
        .digest("hex");

      return serverFingerprint === trustedFingerprint;
    },
  });

  return client;
}


