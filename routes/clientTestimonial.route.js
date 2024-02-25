import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { upload } from '../utils/helpers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { fetchAllTestimonials,CreateTestimonial, updateTestimonials } from '../controllers/index.js';
// Imports

export default class TestimonialAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchAllTestimonials);
        this.router.post('/create', authMiddleware([ROLES.ADMIN]),upload("testimonial").fields([{name:'image',maxCount:'1'}]), CreateTestimonial);
        this.router.put('/update/:id', authMiddleware([ROLES.ADMIN]),upload("testimonial").fields([{name:'image',maxCount:'1'}]),updateTestimonials)
        this.router.delete('/delete',  authMiddleware([ROLES.ADMIN]),fetchAllTestimonials);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/testimonials';
    }
}