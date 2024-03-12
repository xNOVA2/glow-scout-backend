import Joi from "joi";
import { validateRequest } from "./validate.js";


const createReviewValidator = Joi.object({
    rating:Joi.number().required().greater(0).less(6),
    description: Joi.string().trim().required().min(10).message("Description must be 10 character long"),
    from:Joi.string().trim().required(),
    to:Joi.string().trim().required(),

});

export const addReviewValidation = validateRequest(createReviewValidator);