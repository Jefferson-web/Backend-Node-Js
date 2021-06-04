import { Request, Response } from 'express';
import User from '../models/user.schema';
import bcrypt from 'bcryptjs';
import jwtUtil from '../utils/jwt.util';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class AuthController {

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        await User.findOne({ email }, (err: any, user: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(404).json({
                    ok: false,
                    message: 'Bad Credentials',
                    errors: { message: 'Invalid username or password' }
                });
            }
            user.password = undefined;
            const access_token = jwtUtil.generateAccessToken(user);
            res.status(200).json({
                access_token,
                user
            });
        });
    }

    google = async (req: Request, res: Response) => {
        const id_token = req.body['id_token'];
        const googleUser: any = await verify(id_token).catch(e => {
            return res.status(400).json({
                ok: false,
                message: 'Invalid Token',
                errors: e
            });
        });

        User.findOne({ email: googleUser.email }, (err: any, user: any) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar el usuario',
                    errors: err
                });
            }

            if (user) {
                if (user.google === false) {

                    return res.status(400).json({
                        ok: false,
                        message: 'Debe usar su autenticacion normal',
                        errors: err
                    });

                } else {

                    user.password = undefined;
                    const access_token = jwtUtil.generateAccessToken(user);
                    return res.status(200).json({
                        ok: true,
                        user,
                        access_token
                    });

                }
            } else {

                const newUser = new User({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: ':)',
                    img: googleUser.img,
                    google: true
                });

                newUser.save((err, createdUser: any) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Bad Request',
                            errors: err
                        });
                    }
                    createdUser.password = undefined;
                    const access_token = jwtUtil.generateAccessToken(createdUser);
                    res.status(200).json({
                        ok: true,
                        user: createdUser,
                        access_token
                    });
                });

            }

        });

    }

}

async function verify(id_token: string) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

export default new AuthController();