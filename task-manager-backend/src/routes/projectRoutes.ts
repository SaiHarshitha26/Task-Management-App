import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { projectSchema } from "../utils/validationSchemas";

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.post("/", validate(projectSchema), createProject);
router.put("/:id", validate(projectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
