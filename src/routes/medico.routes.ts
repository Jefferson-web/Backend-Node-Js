import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application } from 'express';
import medicoController from '../controllers/medico.controller';
import medicoMiddleware from '../middlewares/medico.middleware';
import authMiddleware from '../middlewares/auth.middleware';

export default class MedicoRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'MedicoRoutes');
    }

    configureRoutes() {
        this.app.route('/medicos')
            .get(medicoController.findMedicos)
            .post([authMiddleware.verifyToken], medicoController.createMedico);

        this.app.route('/medicos/:id')
            .put(
                [authMiddleware.verifyToken, medicoMiddleware.validateMedicoExists],
                medicoController.updateMedico)
            .delete(
                [authMiddleware.verifyToken, medicoMiddleware.validateMedicoExists],
                medicoController.deleteMedico);

        return this.app;
    }

}