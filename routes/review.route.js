import { Router } from 'express';
import { createReviews, getReviews } from '../controllers/index.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addReviewValidation } from '../validators/index.js';

export default class ReviewAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/:id', getReviews);
        this.router.post('/create',authMiddleware(ROLES.USER), addReviewValidation,createReviews);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/review';
    }
}