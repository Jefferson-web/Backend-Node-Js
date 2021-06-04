import { NextFunction, Request, Response } from 'express';
import jwt from '../utils/jwt.util';

class AuthMiddleware {

    verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const authorizationHeader = String(req.headers.authorization);
        if (authorizationHeader) {
            try {
                let authorization = authorizationHeader.split(" ");
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    const decoded: any = jwt.verifyToken(authorization[1]);
                    req.body.user = decoded['payload'];
                    return next();
                }
            } catch (error) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }

}

export default new AuthMiddleware();