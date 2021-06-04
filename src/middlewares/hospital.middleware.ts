import { Request, Response, NextFunction } from 'express';
import Hospital from '../models/hospital.schema';

class HospitalMiddleware {

    validateHospitalExists = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params['id'];
        await Hospital.findById(id, (err: any, hospital: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(404).json({
                    ok: false,
                    message: 'Resource Not Found',
                    errors: { message: `Hospital with id ${id} doesn\'t exists` }
                })
            }
            req.body.hospital = hospital;
            next();
        })
    }

}

export default new HospitalMiddleware();