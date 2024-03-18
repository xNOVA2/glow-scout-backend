import { generateResponse, asyncHandler } from "../utils/helpers.js";
import { treatmentCount } from "../models/index.js";
import { totalReviews } from "../models/review.model.js";
import { addVisitedSpa, getAllVisitedSpa } from "../models/visted.model.js";
import { createLike, findLike, getLikeCount } from "../models/like.model.js";

export const getTreatmentCount = asyncHandler(async (req, res, next) => {
  const count = await treatmentCount(req.user.id);
  const Reviews = await totalReviews(req.user.id);
  const vistedList = await getAllVisitedSpa(req.user.id);
  const Likes = await getLikeCount(req.user.id);

  generateResponse(
    { count, reviews: Reviews, vistedList, Likes },
    "Analytics Reports",
    res
  );
});

export const visitSpa = asyncHandler(async (req, res, next) => {
  const visit = await addVisitedSpa(req.body);
  generateResponse(visit, "Spa visited", res);
});

export const createLikes = asyncHandler(async (req, res, next) => {

  const like = await findLike({ spa: req.body.spa, user: req.user.id });

  if (like) {
    like.liked = !like.liked;
    await like.save();
    generateResponse(
      { message: like },
      `${like.liked ? "Liked" : "disliked"}`,
      res
    );
  } else {
    const newLike = await createLike({
      spa: req.body.spa,
      user: req.user.id,
      liked: true,
    });
    generateResponse(newLike, "Like the spa", res);
  }
});

export const isLiked = asyncHandler(async (req, res, next) => {
  const like = await findLike({ spa: req.params.id, user: req.user.id });
  generateResponse(like, "Like the spa", res);
});