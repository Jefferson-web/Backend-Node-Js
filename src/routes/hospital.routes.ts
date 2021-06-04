import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application } from 'express';
import hospitalController from '../controllers/hospital.controller';
import authMiddleware from '../middlewares/auth.middleware';
import hospitalMiddleware from '../middlewares/hospital.middleware';

export default class HospitalRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'HospitalRoutes');
    }

    configureRoutes() {
        this.app.route('/hospitals')
            .get(hospitalController.findHospitals)
            .post([authMiddleware.verifyToken], hospitalController.createHospital);

        this.app.route('/hospitals/:id')
            .all([authMiddleware.verifyToken, hospitalMiddleware.validateHospitalExists])
            .put(hospitalController.updateHospital)
            .delete(hospitalController.deleteHospital);

        return this.app;
    }

}