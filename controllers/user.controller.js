import { updateUser, findUser } from "../models/index.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { STATUS_CODES } from "../utils/constants.js";

export const updateUsers = asyncHandler(async (req, res, next) => {
  // Check if user email already exists

  const existingUser = await findUser({ $or: [{ email: req.body.email }] });

  if (existingUser && existingUser.id !== req.user.id) {
    return next({
      statusCode: STATUS_CODES.CONFLICT,
      message: "Email already exists",
    });
  }
  
  if (req?.files?.profileImage?.length > 0) {
    let imageURL = await uploadOnCloudinary(req.files.profileImage[0].path);

    if (!imageURL) {
      return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Image failed while uploading on cloudinary",
      });
    }

    req.body.profileImage = imageURL.secure_url;
  }

  const user = await updateUser(req.user.id, req.body);

  generateResponse(user, "User updated successfully", res);
});
