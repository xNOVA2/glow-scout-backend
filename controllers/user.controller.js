import { updateUser, findUser, getUser } from "../models/index.js";
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


export const getAllUsers = asyncHandler(async (req, res,next) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const search = req.query.search || "";
  const filter = req.query.filter || "";
  let sortDirection = 1; // Default is ascending order (A to Z)

  
  if (filter.toLowerCase() === "ztoa") {
    sortDirection = -1; // Set to -1 for descending order (Z to A)
  }

  const user = await getUser({
    query: { name: { $regex: `^${search}`, $options: "i" } },
    page,
    limit,
    sort: { name: sortDirection }, 
  });

  generateResponse(user, "Users fetched successfully", res);
});
