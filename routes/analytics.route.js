import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { getTreatmentCount } from '../controllers/analytics.controller.js';

export default class AnalyticsAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/count',authMiddleware(ROLES.BUSINESS), getTreatmentCount);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/analytics';
    }
}