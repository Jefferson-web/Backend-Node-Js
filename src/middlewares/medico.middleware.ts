import { Request, Response, NextFunction } from 'express';
import Medico from '../models/medico.schema';

class MedicosMiddleware {

    validateMedicoExists = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params['id'];
        await Medico.findById(id, (err: any, medico: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(404).json({
                    ok: false,
                    message: 'Resource Not Found',
                    errors: { message: `Medico with id ${id} doesn\'t exists` }
                })
            }
            req.body.medico = medico;
            next();
        })
    }

}

export default new MedicosMiddleware();