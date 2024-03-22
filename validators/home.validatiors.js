import Joi from "joi";
import { validateRequest } from "./validate.js";


const createHome = Joi.object({
    heading1: Joi.string().trim().required().min(3).message("Heading must be 3 character long"),
    heading2: Joi.string().trim().required().min(3).message("Heading must be 3 character long"),
    aboutUs: Joi.string().trim().required().min(15).message("About us must be 15 character long"),
    text: Joi.string().trim().required().min(3).message("Text must be 3 character long"),
    buttonText: Joi.string().trim().required().min(3).message("Button text must be 3 character long"),
    buttonLink: Joi.string().trim().required().min(3).message("Button link must be 3 character long"),
});

export const landingPageValidation = validateRequest(createHome);