import { Router } from 'express';
import RootAPI from './root.route.js';
import AuthAPI from './auth.route.js';
import GoalAPI from './goal.route.js';
import TreatmentAPI from './treatment.route.js';
import BlogApi from './blog.route.js';
import SettingApi from './setting.route.js';
import SpasApi from './spas.route.js';
import UserApi from './user.route.js';
import TestimonialAPI from './clientTestimonial.route.js';
import CitiesAPI from './cities.route.js';
import BookAPI from './book.route.js';
import SubcriptionAPI from './stripe.route.js';
// import UserAPI from './user.route.js';

export default class API {
    constructor(app) {
        this.app = app;
        this.router = Router();
        this.routeGroups = [];
    }

    loadRouteGroups() {
        this.routeGroups.push(new RootAPI());
        this.routeGroups.push(new AuthAPI());
        this.routeGroups.push(new GoalAPI());
        this.routeGroups.push(new TreatmentAPI());
        this.routeGroups.push(new BlogApi());
        this.routeGroups.push(new SettingApi());
        this.routeGroups.push(new SpasApi());
        this.routeGroups.push(new UserApi());
        this.routeGroups.push(new TestimonialAPI());
        this.routeGroups.push(new CitiesAPI());
        this.routeGroups.push(new BookAPI());
        this.routeGroups.push(new SubcriptionAPI());
    }

    setContentType(req, res, next) {
        res.set('Content-Type', 'application/json');
        next();
    }

    registerGroups() {
        this.loadRouteGroups();
        this.routeGroups.forEach((rg) => {
            console.log('Route group: ' + rg.getRouterGroup());
            this.app.use('/api' + rg.getRouterGroup(), this.setContentType, rg.getRouter());
        });
    }
}