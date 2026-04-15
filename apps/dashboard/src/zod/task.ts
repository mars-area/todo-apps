import z from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
});

export const taskUpdateSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed"]),
});
