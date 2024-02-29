import { Router } from 'express';
import { fetchCities } from '../controllers/cities.controller.js';

export default class CitiesAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    
    setupRoutes() {
        this.router.get('/', fetchCities);
    }
    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/cities';
    }
}