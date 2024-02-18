import Joi from "joi";
import { validateRequest } from "./validate.js";


const addGoalValidator = Joi.object({
    title: Joi.string().trim().required().min(3),
});

const updateGoalValidator = Joi.object({
    title: Joi.string().trim().required().min(3),
});

export const addGoalValidation = [validateRequest(addGoalValidator)];
export const updateGoalValidation = [validateRequest(updateGoalValidator)];