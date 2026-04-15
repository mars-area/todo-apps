import Joi from "joi";
import validate from "../middlewares/request";

const emailSignIn = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  }).required()
};

const emailSignUp = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  }).required()
};

export default {
  emailSignIn: validate(emailSignIn),
  emailSignUp: validate(emailSignUp)
};
