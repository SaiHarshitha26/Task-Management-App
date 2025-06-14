import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  email: string;
  designation: string;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
});

export default mongoose.model<ITeam>("Team", TeamSchema);
