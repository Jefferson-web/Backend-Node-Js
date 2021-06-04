import jwt, { SignOptions } from 'jsonwebtoken';

export default class JWTUtil {

    static generateAccessToken(payload: any) {
        const options: SignOptions = { expiresIn: '1h' };
        return jwt.sign({payload}, String(process.env.SECRET_KEY), options);
    }

    static verifyToken(token: string) {
        return jwt.verify(token, String(process.env.SECRET_KEY));
    }

}