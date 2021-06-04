import { CommonRoutesConfig } from "../common/common.routes.config";
import uploadController from '../controllers/upload.controller';
import { Application } from 'express';
import userMiddleware from '../middlewares/users.middleware';

export default class UploadsRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'UploadsRoutes');
    }

    configureRoutes() {

        this.app.put('/uploads/:collection/:id',
            uploadController.uploadImage);
        return this.app;
    }

}