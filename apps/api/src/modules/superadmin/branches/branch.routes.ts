import { Router } from "express";
import * as branchController from "./branch.controller";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { testBranchConnectionController, getBranchFilesController } from "./connection/connection.controller";

const router = Router();

router.use(authenticate, authorize({ roles: ["SUPER_ADMIN"] }));

router.get("/", branchController.getBranchesController);
router.get("/:id", branchController.getBranchByIdController);
router.post("/add-branch", branchController.createBranchController);
router.patch("/:id", branchController.updateBranchController);
router.patch("/:id/status", branchController.updateBranchStatusController);

router.post("/:id/test-connection",testBranchConnectionController);
router.get("/:id/files",getBranchFilesController);

export default router;
