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

      const imageUrl = await uploadOnCloudinary(req.files.image[0].path);

      if(!imageUrl){
          return next({
              statusCode: STATUS_CODES.BAD_REQUEST,
              message: "Image failed why uploading on cloudinary",
              });
      }
     req.body.profileImage = imageUrl.secure_url;
  
    const user = await updateUser(id,req.body);    
    
    generateResponse(user, "User updated successfully", res);
})
