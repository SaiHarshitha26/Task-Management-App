import express from "express";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController";
import { protect } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { teamSchema } from "../utils/validationSchemas";

const router = express.Router();

router.use(protect);

router.get("/", getTeams);
router.post("/", validate(teamSchema), createTeam);
router.put("/:id", validate(teamSchema), updateTeam);
router.delete("/:id", deleteTeam);

export default router;
