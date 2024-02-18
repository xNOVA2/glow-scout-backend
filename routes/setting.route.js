import { Router } from 'express';
import { Fetchsetting,createSettingPost } from '../controllers/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {settingValidation} from '../validators/index.js'
import { ROLES } from '../utils/constants.js';



export default class SettingApi {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.post('/create',  authMiddleware(ROLES.ADMIN),settingValidation, createSettingPost);
        this.router.get('/',  Fetchsetting);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/setting';
    }
}