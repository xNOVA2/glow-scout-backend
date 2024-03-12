import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { createReview, fetchReview } from "../models/review.model.js";

export const createReviews = asyncHandler(async (req, res) => {

  const review = await createReview(req.body);
  return generateResponse(review, "Review Created sucessfully", res);

});

export const getReviews = asyncHandler(async (req, res, next) => {
  const review = await fetchReview({ to: req.params.id });
  return generateResponse(review, "Reviews Fetch sucessfully", res);
});
