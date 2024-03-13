import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { treatmentCount } from '../models/index.js';
import { totalReviews } from '../models/review.model.js';

export const getTreatmentCount =  asyncHandler(async (req, res,next) => {
    const count = await treatmentCount(req.user.id);
    
    const Reviews = await totalReviews(req.user.id);
    generateResponse({ count, reviews: Reviews }, "Analytics Reports", res);
});

