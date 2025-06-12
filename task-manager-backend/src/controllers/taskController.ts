import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Task from "../models/Task";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const filter: any = {};

  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.assignedMember) filter.assignedMembers = req.query.assignedMember;

  if (req.query.search) {
    const regex = new RegExp(req.query.search as string, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  if (req.query.startDate && req.query.endDate) {
    filter.deadline = {
      $gte: new Date(req.query.startDate as string),
      $lte: new Date(req.query.endDate as string),
    };
  }

  const count = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedMembers", "name email designation")
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ tasks, page, pages: Math.ceil(count / limit) });
});

export const getTaskSuggestions = asyncHandler(async (req: Request, res: Response):Promise<any> => {
  const search = req.query.search as string;

  if (!search) {
    return res.json([]);
  }

  const regex = new RegExp("^" + search, "i"); // starts with
  const tasks = await Task.find({ title: regex }).limit(10).select("title");

  res.json(tasks.map(task => task.title));
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, deadline, project, assignedMembers, status } = req.body;

  const exists = await Task.findOne({ title });
  if (exists) {
    res.status(400).json({ message: "Task with this title already exists" });
    return;
  }

  const task = await Task.create({
    title,
    description,
    deadline,
    project,
    assignedMembers,
    status,
  });

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  const { title, description, deadline, project, assignedMembers, status } = req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.deadline = deadline || task.deadline;
  task.project = project || task.project;
  task.assignedMembers = assignedMembers || task.assignedMembers;
  task.status = status || task.status;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
});
