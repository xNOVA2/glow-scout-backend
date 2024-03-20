import { Router } from 'express';
import { createBlogPost,updateBlogPost,fetchBlogs,getBlog,deleteBlogPost, toggleFeature, findFeatureBlog } from '../controllers/index.js';
import {addBlogValidation,updateBlogValidation} from '../validators/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { upload } from '../utils/helpers.js';

export default class BlogApi {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchBlogs);
        this.router.get('/feature/',findFeatureBlog)
        this.router.get('/:id', getBlog);
        this.router.put('/update/:id',authMiddleware(ROLES.ADMIN),upload("blog").fields([{name:'coverPicture',maxCount:'1'}]), updateBlogValidation, updateBlogPost);
        this.router.put('/toggle/feature/:id',authMiddleware(ROLES.ADMIN), toggleFeature);
        this.router.delete('/delete/:id',authMiddleware(ROLES.ADMIN), deleteBlogPost);
        this.router.post('/create',authMiddleware(ROLES.ADMIN), upload("blog").fields([{name:'coverPicture',maxCount:'1'}]),addBlogValidation, createBlogPost);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/blogs';
    }
}