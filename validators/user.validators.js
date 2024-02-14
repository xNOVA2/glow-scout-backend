import Joi from "joi";
import { validateParams, validateRequest } from "./validate.js";

const addOrUpdateUserValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required(),
});

const userIdPathValidator = Joi.object({
    userId: Joi.string().hex().length(24).required(),
});

export const userUpdateValidation = validateRequest(addOrUpdateUserValidator);
export const deleteUserValidation = validateParams(userIdPathValidator);