import {  updateUser } from "../models/index.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
// get all users

export const updateUsers = asyncHandler(async (req, res, next) => {
    
    if(req?.files?.profileImage?.length>0) {
   
        let imageURL = await uploadOnCloudinary(req.files.profileImage[0].path);

        if(!imageURL){
          return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "Image failed why uploading on cloudinary",
          });
        }
    
        req.body.profileImage = imageURL.secure_url
    
      }

    const user = await updateUser(req.user.id,req.body);

    generateResponse(user, "User updated successfully", res);
})
