import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PORT, MONGO_URI } from "./config";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
