import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Team from "../models/Team";

export const getTeams = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const count = await Team.countDocuments();
  const teams = await Team.find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ teams, page, pages: Math.ceil(count / limit) });
});

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, designation } = req.body;

  const exists = await Team.findOne({ email });
  if (exists) {
    res.status(400).json({ message: "Team member with this email already exists" });
    return;
  }

  const team = await Team.create({ name, email, designation });
  res.status(201).json(team);
});

export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404).json({ message: "Team member not found" });
    return;
  }

  const { name, email, designation } = req.body;
  team.name = name || team.name;
  team.email = email || team.email;
  team.designation = designation || team.designation;

  const updatedTeam = await team.save();
  res.json(updatedTeam);
});

export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404).json({ message: "Team member not found" });
    return;
  }

  await team.deleteOne();
  res.json({ message: "Team member removed" });
});
