import { Request, Response, NextFunction } from 'express';
import User from '../models/user.schema';

class UsersMiddleware {

    validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params['id'];
        await User.findById(id, (err: any, user: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: 'Resource Not Found',
                    errors: { message: `User with id ${id} doesn\'t exists` }
                })
            }
            req.body.user = user;
            next();
        })
    }

}

export default new UsersMiddleware();