import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application } from 'express';
import searchController from '../controllers/search.controller';

export default class SearchRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'SearchRoutes');
    }

    configureRoutes() {
        this.app.get('/search/:q', searchController.search);

        return this.app;
    }

}