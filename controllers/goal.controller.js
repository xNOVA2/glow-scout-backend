import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { STATUS_CODES } from "../utils/constants.js";
import {
  createGoal,
  findGoal,
  getAllGoals,
  updateGoal,
} from "../models/goal.model.js";

// Create Goal API
export const mutateGoal = asyncHandler(async (req, res, next) => {


  const goal = await createGoal(req.body);
  return generateResponse(goal, "Goal created successfully", res);
});

// Update Goal API
export const updateGoals = asyncHandler(async (req, res, next) => {
 

  const id = req.params.id;
  const goal = await updateGoal(id, req.body);

  if (!goal) {
    return next({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Goal not found",
    });
  }

   generateResponse(goal, "Goal updated successfully", res);
});

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
