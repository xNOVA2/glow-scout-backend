import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { createBookTreatment, fetchBookTreatments } from '../controllers/book.controller.js';
import { createBookValidation } from '../validators/book.validators.js';

export default class BookAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchBookTreatments);
        this.router.post('/create',authMiddleware(ROLES.USER),createBookValidation, createBookTreatment);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/book';
    }
}