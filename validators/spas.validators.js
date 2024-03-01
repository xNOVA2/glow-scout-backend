import Joi from "joi";
import { validateRequest } from "./validate.js";

const daySchema = Joi.object({
  ON: Joi.boolean().default(false),
  startTime: Joi.string().trim().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [AP]M$/).default("09:00 AM"),
  endTime: Joi.string().trim().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [AP]M$/).default("06:00 PM")
});

const SpasUpdateValidator = Joi.object({
  name: Joi.string().trim().required().min(3).message("Name must be 3 characters long"),
  email: Joi.string().trim().required().email().message("Email must be valid"),
  phone: Joi.string().trim().required().min(10).message("Phone must be 10 characters long"),
  alternateEmail: Joi.string().trim().min(10).message("Alternate Email must be 10 characters long"),
  businessEmail: Joi.string().trim().min(10).message("Business Email must be 10 characters long"),
  city: Joi.string().trim().min(3).message("City must be 3 characters long"),
  links: Joi.array().items(
    Joi.object({
      platform: Joi.string().trim().valid('facebook', 'instagram', 'snapchat'),
      url: Joi.string().trim()
    })
  ),
  businessTiming: Joi.object({
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
  }),
});

export const SpasUpdateValidation = validateRequest(SpasUpdateValidator);
