import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  teamMembers: Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "No description" },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});

export default mongoose.model<IProject>("Project", ProjectSchema);
