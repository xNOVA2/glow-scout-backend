import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { upload } from '../utils/helpers.js';

import { GetSpa, UpdateSpas, fetchSpas, findSpasTreatment } from '../controllers/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { SpasUpdateValidation } from '../validators/spas.validators.js';

export default class SpasApi {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchSpas); // all hte spas
        this.router.get('/:id', GetSpa);
        this.router.get('/SimilarTreatments/:id', findSpasTreatment); // all the spas offerering the similar treatment
        this.router.put('/update',authMiddleware(ROLES.BUSINESS),upload("spas").fields([{name:'profileImage',maxCount:'1'},{name:'showcaseImages',maxCount:'2'}]),SpasUpdateValidation, UpdateSpas);

    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/spas';
    }
}