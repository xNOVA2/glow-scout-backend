import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { STATUS_CODES } from "../utils/constants.js";

import {
  createGoal,
  findGoal,
  getAllGoals,
  updateGoal,
} from "../models/goal.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Create Goal API
export const CreateGoals = asyncHandler(async (req, res, next) => {

  const isGoalExist = await findGoal({ title: req.body.title });

  if(isGoalExist) return next({
    statusCode: STATUS_CODES.CONFLICT,
    message: "Goal already exist",
  })
  
  if(!req.files?.image || req.files?.image.length===0) return next({
    statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
    message: "Image is required",
  });

  let imageURL = await uploadOnCloudinary(req.files.image[0].path);
  req.body.image = imageURL.secure_url 

  const goal = await createGoal(req.body);

  generateResponse(goal, "Goal created successfully", res);
});

// Update Goal API
export const updateGoals = asyncHandler(async (req, res, next) => {
 
  const id = req.params.id;

  if(!id) return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: "Id is required",
  });
  
  if(!req.files?.image || req.files?.image.length===0) return next({
      statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
      message: "Image is required",
  });
  
  let imageURL = await uploadOnCloudinary(req.files.image[0].path);
  
  if(!imageURL){
    return next({
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Image failed why uploading on cloudinary",
    });
  }

  req.body.image = imageURL.secure_url
  const goal = await updateGoal(id, req.body);

  if (!goal) {
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Goal not found",
    });
  }

   generateResponse(goal, "Goal updated successfully", res);
});

// Fetch All Goals
export const getGoals = asyncHandler(async (req, res, next) => {

  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  const goals = await getAllGoals({ query: {}, page, limit});
  
  generateResponse(goals, "Goals fetched successfully", res);
});

// Delete Goal API 
export const deleteGoal = asyncHandler(async (req, res, next) => {

  const id = req.params.id;
  const goal = await findGoal({_id: id});
  
  if (!goal) {
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Goal not found",
    });
  }

  goal.isDeleted = true;
  goal.save();
  
   generateResponse(goal, "Goal deleted successfully", res);
});
