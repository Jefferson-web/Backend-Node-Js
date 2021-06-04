import { CommonRoutesConfig } from "../common/common.routes.config";
import express from 'express';
import userController from '../controllers/user.controller';
import usersMiddleware from '../middlewares/users.middleware';
import authMiddleware from '../middlewares/auth.middleware';

export default class UserRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    }

    configureRoutes() {

        this.app.route('/users')
            .get(userController.findUsers)
            .post(userController.createUser);
        this.app.route('/users/:id')
            .all([authMiddleware.verifyToken, usersMiddleware.validateUserExists])
            .put(userController.updateUser)
            .delete(userController.removeUserById);

        return this.app;
    }

}