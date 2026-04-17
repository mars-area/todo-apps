import Joi from "joi";
import validate from "../middlewares/request";

const listUsers = {
  query: Joi.object({
    page: Joi.number().default(1).optional(),
    limit: Joi.number().default(10).optional(),
    sort: Joi.string().valid("createdAt").default("createdAt").optional(),
    order: Joi.string().valid("ASC", "DESC").default("DESC").optional(),
    status: Joi.string().optional(),
    type: Joi.string().optional(),
    search: Joi.string().optional()
  })
};

const detailedUsers = {
  params: Joi.object({
    uid: Joi.number().integer().positive().required()
  }).required()
};

const getHistoricalTotals = {
  query: Joi.object({
    dateStart: Joi.string()
      .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}[T][0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}[Z]$/)
      .messages({
        "string.pattern.base": "startDate must be in this format YYYY-MM-DDTHH:mm:ssZ"
      })
      .required(),
    dateEnd: Joi.string()
      .pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}[T][0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}[Z]$/)
      .messages({
        "string.pattern.base": "startDate must be in this format YYYY-MM-DDTHH:mm:ssZ"
      })
      .required()
  })
};

export default {
  detailedUsers: validate(detailedUsers),
  getHistoricalTotals: validate(getHistoricalTotals),
  listUsers: validate(listUsers)
};
