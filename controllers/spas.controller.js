import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { ROLES, STATUS_CODES } from "../utils/constants.js";
import { findAllSpasTreatment } from "../models/treatment.model.js";
import { findUser, getAllUsers, updateUser } from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const findSpasTreatment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id)
    return next({
      message: "Id not found",
      statusCode: STATUS_CODES.NOT_FOUND,
    });

  const spas = await findAllSpasTreatment(id);

  generateResponse(spas, "Spas Treatment fetched successfully", res);
});

export const fetchSpas = asyncHandler(async (req, res, next) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const search = req.query.search || "";
  const filter = req.query.filter || "";
  let sortDirection = 1; // Default is ascending order (A to Z)

  if (filter.toLowerCase() === "ztoa") {
    sortDirection = -1; // Set to -1 for descending order (Z to A)
  }

  const spas = await getAllUsers({
    query: { name: { $regex: `^${search}`, $options: "i" } },
    page,
    limit,
    sort: { name: sortDirection }, // Sort by title in specified direction
    role: "business",
  });

  generateResponse(spas, "Spas fetched successfully", res);
});

export const UpdateSpas = asyncHandler(async (req, res, next) => {
    
  const existingUser = await findUser({
    $or: [{ email:req.body.email }],
    _id: { $ne: req.user.id }, 
  });

  
  if (existingUser) {
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
        message: "Image failed why uploading on cloudinary",
      });
    }

    req.body.profileImage = imageURL.secure_url;
  }
  console.log(req.files);
  if (req?.files?.showcaseImages?.length > 0) {
    const showcaseImages = req.files?.showcaseImages;

    if (showcaseImages && showcaseImages.length > 0) {
      const uploadedPaths = await Promise.all(
        showcaseImages.map(async (image) => {
          const imagePath = image.path;
          const cloudinaryUrl = await uploadOnCloudinary(imagePath);
          return cloudinaryUrl.secure_url;
        })
      );

      // Now, 'uploadedPaths' is an array containing the Cloudinary URLs of the uploaded images
      req.body.showcaseImages = uploadedPaths;
    }
  }
  const spa = await updateUser(req.user.id, req.body);

  generateResponse(spa, "Spa updated successfully", res);
});

export const GetSpa = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id)
    return next({
      message: "Id not found",
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
    });

  const spa = await findUser({ _id: id });

  if (!spa)
    return next({
      message: "Spa not found",
      statusCode: STATUS_CODES.NOT_FOUND,
    });

  generateResponse(spa, "Spa fetched successfully", res);
});
