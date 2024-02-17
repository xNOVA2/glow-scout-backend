import Joi from "joi";
import { validateRequest } from "./validate.js";


const addGoalValidator = Joi.object({
    title: Joi.string().trim().required(),
    picture: Joi.string().required(),
});

const updateGoalValidator = Joi.object({
    title: Joi.string().trim().required(),
    picture: Joi.string().required(),
});

export const addGoalValidation = [validateRequest(addGoalValidator)];
export const updateGoalValidation = [validateRequest(updateGoalValidator)];