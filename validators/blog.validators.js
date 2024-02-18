import Joi from "joi";
import { validateRequest } from "./validate.js";


const createBlogValidator = Joi.object({
    title: Joi.string().trim().required().min(3).message("Title must be 3 character long"),
    content: Joi.string().trim().required().min(10).message("Content must be 10 character long"),
    isFeatured: Joi.boolean().default(false),


});

const updateBlogValidator = Joi.object({
    title: Joi.string().trim().required().min(3).message("Title must be 3 character long"),
    content: Joi.string().trim().required().min(10).message("Content must be 10 character long"),
    isFeatured: Joi.boolean(),
});

export const addBlogValidation = validateRequest(createBlogValidator);
export const updateBlogValidation = validateRequest(updateBlogValidator);