import validate from "@/middlewares/request";
import Joi from "joi";

const createTask = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid("low", "medium", "high").required(),
    status: Joi.string().valid("pending", "in_progress", "completed").required(),
  }).required()
};

const updateTask = {
  params: Joi.object({
    id: Joi.number().required()
  }).required(),
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  }).required()
};

const deleteTask = {
  params: Joi.object({
    id: Joi.number().required()
  }).required()
};

const getTasks = {
  query: Joi.object({
    page: Joi.number().default(1).optional(),
    limit: Joi.number().default(10).optional(),
    sort: Joi.string().valid("dueDate", "createdAt").default("createdAt").optional(),
    order: Joi.string().valid("ASC", "DESC").default("DESC").optional(),
  }).required()
};

export default {
  createTask: validate(createTask),
  updateTask: validate(updateTask),
  deleteTask: validate(deleteTask),
  getTasks: validate(getTasks)
};