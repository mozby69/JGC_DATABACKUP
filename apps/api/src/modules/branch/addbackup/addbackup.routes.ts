import { Router } from "express";

import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import * as backupController from "./addbackup.controller";

const router = Router();


router.use(authenticate);



router.post("/",backupController.createBackupController);
router.get("/",backupController.getBranchBackupsController);
router.get("/current-branch",authorize({ roles: ["SUPER_ADMIN","BRANCH"]}),backupController.getMyBranchController);
router.get("/:id",backupController.getBackupByIdController);



export default router;