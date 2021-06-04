import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application } from 'express';
import authController from '../controllers/auth.controller';

export default class AuthRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes() {
        this.app.post('/auth/login', authController.login);
        this.app.post('/auth/google', authController.google);

        return this.app;
    }

}