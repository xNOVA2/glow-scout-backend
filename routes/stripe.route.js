import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { subscription } from '../controllers/index.js';

export default class SubcriptionAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', (req, res) => {
            res.send('Welcome to subscription route');
        });
        this.router.post('/create',authMiddleware(ROLES.BUSINESS), subscription);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/subcription';
    }
}