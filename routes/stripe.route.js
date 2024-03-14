import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createStripeSession, fetchPriceIds, subscription } from '../controllers/index.js';

export default class SubcriptionAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
     
        this.router.post('/create',authMiddleware(ROLES.BUSINESS), subscription)
        this.router.post('/session',authMiddleware(ROLES.BUSINESS), createStripeSession);
        this.router.get('/price', fetchPriceIds);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/subcription';
    }
}