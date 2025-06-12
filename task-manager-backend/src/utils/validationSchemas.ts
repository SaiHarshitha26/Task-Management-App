import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const teamSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  designation: z.string().min(2),
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  teamMembers: z.array(z.string()),
});

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  deadline: z.string().refine(date => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  project: z.string().min(1),
  assignedMembers: z.array(z.string()),
  status: z.enum(["to-do", "in-progress", "done", "cancelled"]),
});
