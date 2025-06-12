import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validate } from "../middlewares/validationMiddleware";
import { registerSchema, loginSchema } from "../utils/validationSchemas";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

export default router;
