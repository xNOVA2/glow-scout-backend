import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { STATUS_CODES } from "../utils/constants.js";
import {
  createTreatment,
  deleteTreatment,
  getAllTreatments,
  getAllTreatmentOfSingleGoal,
  updateTreatmentById,
  findTreatment,
  getAllUsers,
} from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Add Treatment API
export const addTreatment = asyncHandler(async (req, res, next) => {
  if (!req.files?.image || req.files?.image.length === 0)
    return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: "Image is required",
    });

  const imageUrl = await uploadOnCloudinary(req.files.image[0].path);

  if (!imageUrl) {
    return next({
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Image failed why uploading on cloudinary",
    });
  }

  req.body.image = imageUrl.secure_url;

  let treatment = await findTreatment({ title: req.body.title });

  if (!treatment) {
    treatment = await createTreatment(req.body);
  }
  const updateTreatment = await updateTreatmentById(treatment._id, {
    $addToSet: { spas: req.user.id },
  });
  generateResponse(updateTreatment, "Treatment created successfully", res);
});

// Get all  the treatment that link with a single goal
export const getAllTreatmentsOfSingleGoals = asyncHandler(
  async (req, res, next) => {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const search = req.query.search || "";
    const filter = req.query.filter || "";

    const goalId = req.params.id;

    if (!goalId) {
      return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Goal id is required",
      });
    }
    let sortDirection = 1; // Default is ascending order (A to Z)

    if (filter.toLowerCase() === "ztoa") {
      sortDirection = -1; // Set to -1 for descending order (Z to A)
    }

    // Pass the search and sort parameters to getAllTreatments function
    const treatments = await getAllTreatmentOfSingleGoal({
      id: goalId,
      query: { title: { $regex: `^${search}`, $options: "i" } },
      page,
      limit,
      sort: { title: sortDirection }, // Sort by title in specified direction
    });
    generateResponse(treatments, "Treatments fetched successfully", res);
  }
);

// Fetch all Treatments
export const fetchTreatments = asyncHandler(async (req, res, next) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const search = req.query.search || "";
  const filter = req.query.filter || "";

  let sortDirection = 1; // Default is ascending order (A to Z)

  if (filter.toLowerCase() === "ztoa") {
    sortDirection = -1; // Set to -1 for descending order (Z to A)
  }

  // Pass the search and sort parameters to getAllTreatments function
  const treatments = await getAllTreatments({
    query: { title: { $regex: `^${search}`, $options: "i" } },
    page,
    limit,
    sort: { title: sortDirection }, // Sort by title in specified direction
  });

  generateResponse(treatments, "Treatments fetched successfully", res);
});

// Update Treatments API
export const updateTreatment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next({
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Treatment id is required",
    });
  }

  if (req?.files?.image?.length > 0) {
    let imageURL = await uploadOnCloudinary(req.files.image[0].path);

    if (!imageURL) {
      return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Image failed why uploading on cloudinary",
      });
    }

    req.body.image = imageURL.secure_url;
  }

  const treatment = await updateTreatmentById(id, req.body);

  if (!treatment) {
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Treatment not found",
    });
  }

  generateResponse(treatment, "Treatment updated successfully", res);
});

// Delete Treatments API
export const deleteTreatments = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  if (!id) {
    return next({
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Treatment id is required",
    });
  }

  const treatment = await deleteTreatment(id);

  if (!treatment) {
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Treatment not found",
    });
  }

  return generateResponse(treatment, "Treatment deleted successfully", res);
});

// get all the Spas that Link with a Treatment
export const getSpasTreatment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const search = req.query.search || "";
  const filter = req.query.filter || "";
  const address = req.query.location || ""
  console.log(search);
  let sortDirection = 1; // Default is ascending order (A to Z)

  if (filter.toLowerCase() === "ztoa") {
    sortDirection = -1; // Set to -1 for descending order (Z to A)
  }

  const treatments = await findTreatment({ _id: id }).select('spas');

  const spasIds = treatments.spas;
  const query = {
    $and: [
      { _id: { $in: spasIds } },
      { name: { $regex: `^${search}`, $options: "i" } }
    ]
  };
  
  const spas = await getAllUsers({
    query,
    role: 'business',
    page,
    limit,
    sort: { name: sortDirection },
    address: { $regex: `^${address}`, $options: "i"}
  });
  generateResponse(spas, 'Spas treatment fetched successfully', res);
});


export const singleTreatment = asyncHandler(async (req, res, next) => {

  const treatment = await findTreatment({_id:req.params.id});
  
  generateResponse(treatment, 'Treatment fetched successfully', res);
}); 