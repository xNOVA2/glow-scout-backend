import Joi from "joi";
import { validateRequest } from "./validate.js";

const settingValidator = Joi.object({
  type: Joi.string().valid("about us", "terms","privacy policy").required(),
  content: Joi.string().min(20).required(),
});


export const settingValidation = validateRequest(settingValidator);
