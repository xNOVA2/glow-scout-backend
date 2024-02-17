import { Router } from 'express';

import { addTreatment,assignTreatmentToSpa, getAllTreatmentsOfSingleGoals,deleteTreatment,fetchTreatments,updateTreatment,getAllTreatmentsByTitleAndUsers } from '../controllers/treatment.controller.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';


export default class TreatmentAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    // add validation later on
    setupRoutes() {
        this.router.get('/', fetchTreatments);
        this.router.get('/:id', getAllTreatmentsOfSingleGoals);
        this.router.get('/getAllTreatmentsOfferBySpas', getAllTreatmentsByTitleAndUsers);
        this.router.post('/create',  authMiddleware([ROLES.BUSINESS]), addTreatment);
        this.router.put('/assign-treatment/:id',  authMiddleware([ROLES.BUSINESS]), assignTreatmentToSpa);
        this.router.put('/update/:id',  authMiddleware(Object.values(ROLES)), updateTreatment);
        this.router.delete('/delete/:id',  authMiddleware(Object.values(ROLES)), deleteTreatment);
     


    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/treatment';
    }
}