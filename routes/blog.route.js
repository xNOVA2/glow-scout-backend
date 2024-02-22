import { Router } from 'express';
import { createBlogPost,updateBlogPost,fetchBlogs,getBlog,deleteBlogPost } from '../controllers/index.js';
import {addBlogValidation,updateBlogValidation} from '../validators/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class BlogApi {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchBlogs);
        this.router.get('/:id', getBlog);
        this.router.put('/update/:id',authMiddleware(ROLES.ADMIN), updateBlogValidation, updateBlogPost);
        this.router.delete('/delete/:id',authMiddleware(ROLES.ADMIN), deleteBlogPost);
        this.router.post('/create',authMiddleware(ROLES.ADMIN), addBlogValidation, createBlogPost);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/blogs';
    }
}