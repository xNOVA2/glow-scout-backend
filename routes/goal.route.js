import { Router } from 'express';
import { addGoalValidation,updateGoalValidation } from '../validators/index.js';
import {  updateGoals, getGoals, deleteGoal,CreateGoals } from '../controllers/goal.controller.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../utils/helpers.js';


export default class GoalAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.post('/create',  authMiddleware(ROLES.ADMIN),upload("goals").fields([{name:'image',maxCount:'1'}]), addGoalValidation, CreateGoals);
        this.router.put('/update/:id', authMiddleware(ROLES.ADMIN),upload("goals").fields([{name:'image',maxCount:'1'}]), updateGoalValidation, updateGoals);
        this.router.delete('/delete/:id',authMiddleware(ROLES.ADMIN),  deleteGoal);
        this.router.get('/',  getGoals);
        

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/goals';
    }
}