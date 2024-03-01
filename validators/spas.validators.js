import Joi from "joi";
import { validateRequest } from "./validate.js";

const SpasUpdateValidator = Joi.object({
  name: Joi.string().trim().required().min(3).message("Name must be 3 characters long"),
  email: Joi.string().trim().required().email().message("Email must be valid"),
  phone: Joi.string().trim().required().min(10).message("Phone must be 10 characters long"),
  alternateEmail: Joi.string().trim().min(10).message("Phone must be 10 characters long"),
  businessEmail: Joi.string().trim().min(10).message("Phone must be 10 characters long"),
  city: Joi.string().trim().min(3).message("City must be 3 characters long"),
  links: Joi.array().items(
    Joi.object({
      platform: Joi.string().trim().valid('facebook', 'instagram', 'snapchat'),
      url: Joi.string().trim()
    })
  ),
  businessTiming: Joi.object({
    Monday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Tuesday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Wednesday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Thursday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Friday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Saturday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
    Sunday: Joi.object({
      ON: Joi.boolean().default(false),
      startTime: Joi.string().trim().default("09:00 AM"),
      endTime: Joi.string().trim().default("06:00 PM"),
    }),
  }),
});

export const SpasUpdateValidation = validateRequest(SpasUpdateValidator);
