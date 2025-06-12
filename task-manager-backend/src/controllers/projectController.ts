import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Project from "../models/Project";

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  
  const count = await Project.countDocuments();
  const projects = await Project.find()
    .populate("teamMembers", "name email designation")
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ projects, page, pages: Math.ceil(count / limit) });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, teamMembers } = req.body;

  const exists = await Project.findOne({ name });
  if (exists) {
    res.status(400).json({ message: "Project with this name already exists" });
    return;
  }

  const project = await Project.create({
    name,
    description,
    teamMembers,
  });
  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  const { name, description, teamMembers } = req.body;
  project.name = name || project.name;
  project.description = description || project.description;
  project.teamMembers = teamMembers || project.teamMembers;

  const updatedProject = await project.save();
  res.json(updatedProject);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  await project.deleteOne();
  res.json({ message: "Project removed" });
});
