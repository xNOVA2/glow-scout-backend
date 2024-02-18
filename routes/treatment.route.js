import { Router } from 'express';
import { addTreatment, getAllTreatmentsOfSingleGoals,deleteTreatments,getSpasTreatment,fetchTreatments,updateTreatment,  } from '../controllers/treatment.controller.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../utils/helpers.js';
import { createTreatmentValidation, updateTreatmentValidation } from '../validators/treatment.validators.js';


export default class TreatmentAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    // add validation later on
    setupRoutes() {
        this.router.get('/', fetchTreatments);
        this.router.get('/spas/:id', getSpasTreatment);
        this.router.get('/goal/:id', getAllTreatmentsOfSingleGoals);
        this.router.post('/create',  authMiddleware([ROLES.BUSINESS]),upload("goals").fields([{name:'image',maxCount:'1'}]), createTreatmentValidation,addTreatment);
        this.router.put('/update/:id',  authMiddleware([ROLES.BUSINESS]),upload("goals").fields([{name:'image',maxCount:'1'}]),updateTreatmentValidation, updateTreatment);
        this.router.delete('/delete/:id',  authMiddleware([ROLES.BUSINESS]), deleteTreatments);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/treatment';
    }
}