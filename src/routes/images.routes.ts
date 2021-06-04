import { CommonRoutesConfig } from "../common/common.routes.config";
import {Application} from 'express';
import imagesController from '../controllers/images.controller';

export default class ImageRoutes extends CommonRoutesConfig{
    
    constructor(app: Application){
        super(app, 'ImagesRoutes');
    }

    configureRoutes(): Application {
        this.app.get('/images/:tipo/:img', imagesController.findImage);
        return this.app;
    }    

}