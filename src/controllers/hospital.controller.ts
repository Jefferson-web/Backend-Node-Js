import { Request, Response } from 'express';
import Hospital from '../models/hospital.schema';

class HospitalController {

    findHospitals = async (req: Request, res: Response) => {
        const page = req.query['p'] ? Number(req.query['p']) : 1;
        const docsToSkip = (page - 1) * 5;
        await Hospital.find({})
            .skip(docsToSkip)
            .limit(5)
            .populate('user', 'name email')
            .exec((err: any, hospitals: any) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Internal Server Error',
                        errors: err
                    });
                }
                Hospital.countDocuments((err, quantity) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Bad Request',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        hospitals,
                        total: quantity
                    });
                });

            });
    }

    createHospital = async (req: Request, res: Response) => {
        const payload = req.body;
        const hospital = new Hospital({
            name: payload.name,
            img: payload.img,
            user: payload.user._id
        });
        await hospital.save((err: any, savedHospital: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Bad Request',
                    errors: err
                });
            }
            res.status(401).json({
                ok: true,
                hospital: savedHospital
            });
        });
    }

    updateHospital = async (req: Request, res: Response) => {
        var hospital = req.body.hospital;
        hospital.name = req.body.name;
        hospital.user = req.body.user._id
        await hospital.save((err: any, updatedHospital: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: updatedHospital
            });
        });
    }

    deleteHospital = async (req: Request, res: Response) => {
        const id = req.params['id'];
        await Hospital.findByIdAndDelete(id, {}, (err: any, deletedHospital: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al eliminar el hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: deletedHospital
            });
        });
    }

}

export default new HospitalController();