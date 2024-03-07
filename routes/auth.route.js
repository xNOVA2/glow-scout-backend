import { Router } from 'express';
import { getCurrentUser, googleAuthHandler, login, logoutUser, otpGenerate, otpVerify, register, resetPassword } from '../controllers/index.js';
import { loginValidation, registerValidation, forgotPasswordValidation } from '../validators/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class AuthAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    // 
    setupRoutes() {
        this.router.post('/register', registerValidation, register);
        this.router.post('/login', loginValidation, login);
        this.router.post('/otp', forgotPasswordValidation, otpGenerate);
        this.router.put('/verify-otp', otpVerify);
        this.router.put('/reset-password', authMiddleware(Object.values(ROLES)), resetPassword);
        this.router.get('/getCurrentUser', authMiddleware(Object.values(ROLES)), getCurrentUser);
        this.router.post('/logout', authMiddleware(Object.values(ROLES)), logoutUser);

        // Googles routes for google authenticate
        this.router.get('/google', googleAuthHandler);

       
     

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}