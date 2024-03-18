import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createHomePages, fetchHomePage } from '../controllers/home.controller.js';
import { landingPageValidation } from '../validators/index.js';
import { upload } from '../utils/helpers.js';

export default class HomeAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/',fetchHomePage );
        this.router.put('/',authMiddleware(ROLES.ADMIN),upload("home").fields([{name:'picture',maxCount:'1'}]) ,landingPageValidation, createHomePages);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/home';
    }
}