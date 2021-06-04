import User from '../models/user.schema';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

class UserController {

    findUsers = async (req: Request, res: Response) => {
        const page = req.query['p'] ? Number(req.query['p']) : 1;
        const docsToSkip = (page - 1) * 5;
        User.find({}, 'name email img rol')
            .skip(docsToSkip)
            .limit(5)
            .exec((err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error en la carga de usuarios',
                        errors: err
                    });
                }
                User.countDocuments((err, quantity) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Bad Request',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        users,
                        total: quantity
                    });
                });
            })
    }

    createUser = async (req: Request, res: Response) => {
        const payload = req.body;
        const user = new User({
            name: payload.name,
            email: payload.email,
            password: bcrypt.hashSync(payload.password),
            img: payload.img,
            rol: payload.rol
        });
        await user.save((err: any, savedUser: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                user: savedUser
            })
        });
    }

    updateUser = async (req: Request, res: Response) => {
        var user = req.body.user;
        user.name = req.body.name;
        user.email = req.body.email;
        user.rol = req.body.rol;
        await user.save((err: any, updatedUser: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            updatedUser.password = undefined;
            res.status(200).json({
                ok: true,
                user: updatedUser
            });
        });
    }

    removeUserById = async (req: Request, res: Response) => {
        const id = req.params['id'];
        await User.findByIdAndDelete(id, {}, (err: any, removedUser: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al eliminar el usuario',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                user: removedUser
            });
        });
    }

}

export default new UserController();