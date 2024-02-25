import {  updateUser } from "../models/index.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';

// get all users
export const updateUsers = asyncHandler(async (req, res, next) => {
    
    const id = req.user.id;

    if(!id) return next({
        message: 'Id not found',
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY
    })
    
    if(!req.files?.profileImage || req.files?.profileImage.length===0) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: "profile Image is required",
      });

    req.body.profileImage = req.files.profileImage[0].path;

    const data  = req.body;

    const user = await updateUser(id,data);    
    generateResponse(user, "User updated successfully", res);
})
