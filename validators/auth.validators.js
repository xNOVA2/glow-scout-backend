import Joi from "joi";
import { validateRequest } from "./validate.js";
import { emailExistsValidator } from "./common.validators.js";
import { ROLES } from "../utils/constants.js";

// user register validator
const userRegisterValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLES)).required(),
});

// user login validator
const userLoginValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    password: Joi.string().required()
});

export const registerValidation = [validateRequest(userRegisterValidator), emailExistsValidator];
export const loginValidation = validateRequest(userLoginValidator);