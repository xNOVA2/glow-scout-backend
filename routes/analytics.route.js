import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createLikes, getTreatmentCount, visitSpa } from '../controllers/analytics.controller.js';

export default class AnalyticsAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/count',authMiddleware(ROLES.BUSINESS), getTreatmentCount);
        this.router.post('/visit', visitSpa);
        this.router.put('/like',authMiddleware(ROLES.USER), createLikes);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/analytics';
    }
}