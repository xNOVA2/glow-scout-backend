import Joi from "joi";
import {  validateRequest } from "./validate.js";


const userUpdateValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    city: Joi.string().trim(),
    phone: Joi.string().trim().min(7).max(12).required(),
    alternateEmail: Joi.string().trim(),
    

});
export const UpdateUserValidation = validateRequest(userUpdateValidator);