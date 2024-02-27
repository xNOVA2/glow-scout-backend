import Joi from "joi";
import { validateRequest } from "./validate.js";
import { emailExistsValidator } from "./common.validators.js";
import { ROLES } from "../utils/constants.js";

// user register validator
const userRegisterValidator = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]*$/)
        .message("Password must be at least 6 characters and contain at least one uppercase letter, one digit, and one special character"),
    role: Joi.string().valid(...Object.values(ROLES).filter(role => role !== ROLES.ADMIN)).required(),
});

// user login validator
const userLoginValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    password: Joi.string().required()
});

const userForgotPasswordValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 })
});

const userOtpVerifyValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    otp: Joi.string().required().length(5)
});
export const registerValidation = [validateRequest(userRegisterValidator), emailExistsValidator];

export const loginValidation = validateRequest(userLoginValidator);
export const forgotPasswordValidation = validateRequest(userForgotPasswordValidator);
