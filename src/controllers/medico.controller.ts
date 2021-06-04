import { Request, Response } from 'express';
import Medico from '../models/medico.schema';

class MedicoController {

    findMedicos = async (req: Request, res: Response) => {
        const page = req.query['p'] ? Number(req.query['p']) : 1;
        const docsToSkip = (page - 1) * 5;
        await Medico.find({})
            .skip(docsToSkip)
            .limit(5)
            .populate('user', 'name email')
            .populate('hospital', 'name')
            .exec((err: any, medicos: any) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Internal Server Error',
                        errors: err
                    });
                }
                Medico.countDocuments((err, quantity) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Bad Request',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        medicos,
                        total: quantity
                    });
                });
            });
    }

    createMedico = async (req: Request, res: Response) => {
        const payload = req.body;
        const medico = new Medico({
            name: payload.name,
            img: payload.img,
            user: payload.user._id,
            hospital: payload.hospital
        });
        await medico.save((err: any, savedMedico: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            res.status(401).json({
                ok: true,
                medico: savedMedico
            });
        });
    }

    updateMedico = async (req: Request, res: Response) => {
        var medico = req.body.medico;
        medico.name = req.body.name;
        medico.user = req.body.user._id;
        medico.hospital = req.body.hospital
        await medico.save((err: any, updatedMedico: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar al medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: updatedMedico
            });
        });
    }

    deleteMedico = async (req: Request, res: Response) => {
        const id = req.params['id'];
        await Medico.findByIdAndDelete(id, {}, (err: any, deletedMedico: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al eliminar al medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: deletedMedico
            });
        });
    }

}

export default new MedicoController();