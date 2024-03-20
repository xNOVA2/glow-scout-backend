import Joi from "joi";
import { validateRequest } from "./validate.js";


const createTreatmentValidator = Joi.object({
    title: Joi.string().trim().min(3).message("Title must be 3 character long").required(),
    description: Joi.string().trim().required().min(8).message("description must be 8 character long"),
    goal: Joi.string().trim().required(),
    price: Joi.string().trim().required()
});

const updateTreatmentValidator = Joi.object({
    title: Joi.string().trim().required().min(3),
    description: Joi.string().trim().required().min(8),
    goal:Joi.string().trim().required(),
    price: Joi.string().trim().required(),
    isFeatured: Joi.boolean().optional(),
});

export const createTreatmentValidation = validateRequest(createTreatmentValidator);
export const updateTreatmentValidation = validateRequest(updateTreatmentValidator);