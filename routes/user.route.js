import { Router } from 'express';
import { updateUsers } from '../controllers/user.controller.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { UpdateUserValidation } from '../validators/user.validators.js';
import { upload } from '../utils/helpers.js';

export default class UserApi {
    
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.put('/update', authMiddleware(ROLES.USER),upload("user").fields([{name:'profileImage',maxCount:'1'}]),UpdateUserValidation,updateUsers);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/users';
    }
}