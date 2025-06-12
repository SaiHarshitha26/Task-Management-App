import express from "express";
import {
  getTasks,
  getTaskSuggestions,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { taskSchema } from "../utils/validationSchemas";


const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.get("/",getTaskSuggestions)
router.post("/", validate(taskSchema), createTask);
router.put("/:id", validate(taskSchema), updateTask);
router.delete("/:id", deleteTask);


export default router;
