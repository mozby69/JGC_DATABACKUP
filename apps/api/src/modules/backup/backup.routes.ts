import { Router } from "express";
import multer from "multer";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { BACKUP_MAX_FILES, BACKUP_MAX_FILE_BYTES } from "@repo/shared";
import * as controller from "./backup.controller";
import { uploadBranch } from "./backup.service";

const router = Router();
router.use(authenticate, authorize({ roles: ["USER", "SUPER_ADMIN"] }));
router.get("/context", controller.context);
router.get(
  "/assignments",
  authorize({ roles: ["SUPER_ADMIN"] }),
  controller.options,
);
router.patch(
  "/assignments/:userId",
  authorize({ roles: ["SUPER_ADMIN"] }),
  controller.assignment,
);
router.get("/", controller.list);
router.get("/:id/files/:fileId", controller.download);
// A per-request disk directory is removed on every success, validation failure, or abort.
router.post("/", async (req, res, next) => {
  let directory: string | undefined;
  try {
    await uploadBranch(req.user!.id);
    directory = await mkdtemp(join(tmpdir(), "backup-upload-"));
    const parse = multer({
      dest: directory,
      limits: {
        fileSize: BACKUP_MAX_FILE_BYTES,
        files: BACKUP_MAX_FILES,
        fields: 2,
        fieldSize: 4096,
        // Busboy emits partsLimit on the boundary, so allow one spare part.
        parts: BACKUP_MAX_FILES + 3,
      },
    }).array("attachments", BACKUP_MAX_FILES);
    await new Promise<void>((resolve, reject) =>
      parse(req, res, (error) => (error ? reject(error) : resolve())),
    );
    await controller.upload(req, res);
  } catch (error) {
    next(error);
  } finally {
    if (directory) await rm(directory, { recursive: true, force: true });
  }
});
export default router;
