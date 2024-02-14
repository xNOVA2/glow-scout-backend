import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/index.js';
import { assignSenior, fetchAllUsers, getListOfSubordinates, getUnassignedUsers, getUser } from '../controllers/index.js';

export default class UserAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.get('/', fetchAllUsers);
        router.get('/un-assigned', authMiddleware(Object.values(ROLES)), getUnassignedUsers);
        router.get('/sub-ordinates', authMiddleware(Object.values(ROLES)), getListOfSubordinates);
        router.get('/:userId', authMiddleware(Object.values(ROLES)), getUser);

        router.put('/assign-senior', authMiddleware(Object.values(ROLES)), assignSenior);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/user';
    }
}