import { validateRequest } from './validate.js';
import Joi from "joi";

const bookTreatmentValidator = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.number().min(7).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    alternateEmail: Joi.string().email().optional(),
    address: Joi.string().required(),
    comment: Joi.string().optional(),
    date: Joi.date().required(),
    time: Joi.string().trim().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [AP]M$/).required(),
    spa: Joi.string().required(),
    treatment: Joi.string().required(),
});

export const createBookValidation = validateRequest(bookTreatmentValidator);
