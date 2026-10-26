# Daily branch backups

This continues the existing `apps/api`, `apps/web`, and `packages/shared` structure. Shared Zod schemas and response types live in `packages/shared/src/schemas/backup`.

## Behavior

- A USER opens `/user/backup`, selects a backup date, enters a subject, and attaches files. Backup number and branch name are read-only. The API creates a unique `BU-<UUID>` number on save.
- A SUPER_ADMIN opens `/superadmin/backup` to view all submissions, filter by branch, search, and download individual attachments. Expand **User branch assignments** to assign each account to a branch.
- Users can list and download their own submissions. They cannot choose another branch, modify SSH settings, or access other users' attachments. Superadmin can view all submissions.
- The browser sends a multipart request to the API. The API stages attachments on disk, then sends them through SFTP to the assigned branch PC's configured backup folder. Downloads travel from that PC through the API to the browser. Branch PCs must therefore be reachable from the API for both operations.
- Remote paths are `<backupFolder>/<YYYY-MM-DD>/<backup-id>/<stored-file-id>`. UUID storage names prevent overwrites and path traversal; the original filename is restored on download. The database records metadata, original names, sizes, and transfer status, not file contents.
- New submissions start as UPLOADING and become COMPLETE only after all remote file sizes are verified. Transfer errors mark the submission FAILED and attempt to remove its partial remote directory. Failed records remain visible for diagnosis; resubmitting creates a new backup number.
- Connection details are snapshotted for each backup. Editing a branch does not redirect old downloads to a different server. Retain the corresponding key files and trusted host entries for historical backups.

## Install and migrate

From the repository root, after configuring `apps/api/.env` for your existing MySQL database:

```bash
pnpm install --frozen-lockfile
pnpm --filter api exec prisma migrate deploy
pnpm --filter api exec prisma generate
```

The migration adds a nullable `users.branchId` column and two new tables, `backups` and `backup_files`. It does not reset the database or delete existing rows. Existing accounts start unassigned. Existing users with backups cannot be deleted; deactivate them instead to preserve backup ownership.

For a fresh setup, the existing seed command also creates SUPER_ADMIN and USER roles:

```bash
pnpm --filter api exec prisma db seed
```

Assign the appropriate role to each account through the existing access-control tools. Then, as superadmin, register the branches and use Backup Management → User branch assignments. Users need the USER role as well as an active assigned branch.

```bash
pnpm --filter api dev
pnpm --filter web dev
```

## Manual SSH/SFTP provisioning

SSH installation and key provisioning are manual. The application does not download/install SSH or distribute private keys to users.

Set these API environment variables:

```dotenv
SFTP_KEY_DIRECTORY=/srv/jgc-backup/ssh-keys
SFTP_KNOWN_HOSTS=/srv/jgc-backup/known_hosts
```

Place each branch connection's private key on the API server, named **exactly its branch code**, for example `/srv/jgc-backup/ssh-keys/BR001`. Branch codes used for SSH lookup must contain only letters, numbers, underscores, or hyphens. Each branch should have its own key. The former shared `SFTP_TEST_KEY_NAME` fallback is no longer used.

Install the matching public key in that branch's SSH account's `authorized_keys`. Unlike the earlier download-only test, uploading needs **write permission** on the configured Windows backup folder. Confirm the SSH user can create directories and upload/download files using your normal SFTP client. Keep private keys outside the repository and browser; restrict permissions to the API process account.

Register independently verified branch host keys in the configured known_hosts file using ordinary, unhashed entries:

```text
192.168.1.101 ssh-ed25519 <verified-base64-public-host-key>
[192.168.1.102]:2222 ssh-ed25519 <verified-base64-public-host-key>
```

The IP/hostname and port must match the branch configuration. Do not blindly trust a newly scanned key. For hostname/IP or host-key changes, verify and register the replacement before connecting. Route networking/VPN so the API can reach each branch's SSH port.

## Limits and operations

- Maximum 10 attachments per submission, 1 GiB per file. These limits are shared with the browser and enforced by multipart parsing on the API.
- Reserve temporary disk capacity for concurrent uploads (up to 10 GiB each) and downloads. Uploaded temporary files are removed after normal success/failure and parsed-request errors; downloaded temporary files are removed after the response finishes.
- Configure any reverse proxy's body-size and upload/response timeouts for these limits and branch network speeds. The UI reports browser-to-API progress, followed by an SFTP transfer message; it does not report remote byte progress.
- Keep the browser open until completion. There is no background job queue, automatic retry, or resume in this implementation. A hard API/process crash may leave temporary files, an UPLOADING row, or remote partial files; verify the files before clearing/retrying such records. A host/process failure cannot run the normal cleanup handler.
- Files currently reside on branch PCs. This is not yet an independent central copy or scheduled pull of entire branch directories. Existing branch files are not automatically indexed as submissions.

## Endpoints

All endpoints require cookie authentication. The API verifies roles and ownership independently of the UI.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/backups/context` | Current user's assigned branch (safe display fields only) |
| GET | `/api/backups` | Paginated list; USER sees own records, SUPER_ADMIN sees all |
| POST | `/api/backups` | Multipart `backupDate`, `subject`, and `attachments` files |
| GET | `/api/backups/:id/files/:fileId` | Authorized attachment download |
| GET | `/api/backups/assignments` | Superadmin's users and branch choices |
| PATCH | `/api/backups/assignments/:userId` | Superadmin assigns `{ "branchId": 1 }` or null |

Branch-management endpoints now require SUPER_ADMIN, including connection tests and remote file listings.

## Validation

```bash
pnpm --filter api exec tsc --noEmit
pnpm --filter web exec tsc --noEmit
pnpm --filter api test:run
```

Automated service tests cover branch ownership, inactive/unassigned users, SFTP success, transfer-size failure cleanup, connection failure status, historical connection snapshots, download permissions, key-name traversal, and invalid dates. SFTP is mocked in these tests. Verify a real upload/download against a manually configured branch before deployment.
