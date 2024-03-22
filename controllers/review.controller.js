import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { createReview, fetchReview } from "../models/review.model.js";
import { findUser } from "../models/user.model.js";

export const createReviews = asyncHandler(async (req, res) => {

  const review = await createReview(req.body);
  const spa = await findUser({ _id: req.body.to });;
  if(!spa) next({
    message: "Spa not found",
    statusCode: 404
  })
  spa.rating += req.body.rating;
  spa.save()
  return generateResponse(review, "Review Created sucessfully", res);

});

export const getReviews = asyncHandler(async (req, res, next) => {
  const review = await fetchReview({ to: req.params.id });
  return generateResponse(review, "Reviews Fetch sucessfully", res);
});
