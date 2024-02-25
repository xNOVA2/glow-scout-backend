import Joi from "joi";
import { validateRequest } from "./validate.js";


const SpasUpdateValidator = Joi.object({
    name: Joi.string().trim().required().min(3).message("Name must be 3 character long"),
    email: Joi.string().trim().required().email().message("Email must be valid"),
    phone:Joi.string().trim().required().min(10).message("Phone must be 10 character long"),
    alternateEmail:Joi.string().trim().min(10).message("Phone must be 10 character long"),
    businessEmail:Joi.string().trim().min(10).message("Phone must be 10 character long"),
    city:Joi.string().trim().min(3).message("City must be 3 character long"),
    
});

export const SpasUpdateValidation = validateRequest(SpasUpdateValidator);
