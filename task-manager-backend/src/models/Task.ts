import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  project: Types.ObjectId;
  assignedMembers: Types.ObjectId[];
  status: "to-do" | "in-progress" | "done" | "cancelled";
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, default: "No description" },
  deadline: { type: Date, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  assignedMembers: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  status: { type: String, enum: ["to-do", "in-progress", "done", "cancelled"], default: "to-do" },
});

export default mongoose.model<ITask>("Task", TaskSchema);
