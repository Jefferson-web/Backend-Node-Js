import { Request, Response } from 'express';
import Hospital from '../models/hospital.schema';
import Medico from '../models/medico.schema';
import User from '../models/user.schema';

class SearchController {

    search = (req: Request, res: Response) => {
        const toFind = req.params['q'];
        const regExp = new RegExp(toFind, 'i');
        Promise.all([
            this.findHospitals(regExp),
            this.findMedicos(regExp),
            this.findUsers(regExp)
        ])
            .then(response => {
                res.status(200).json({
                    ok: true,
                    hospitals: response[0],
                    medicos: response[1],
                    users: response[2]
                });
            });
    }

    findHospitals = (regExp: RegExp) => {
        return new Promise((resolve, reject) => {

            Hospital.find({ name: regExp }, (err, hospitals) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hospitals);
                }
            });

        });
    }

    findMedicos = (regExp: RegExp) => {
        return new Promise((resolve, reject) => {

            Medico.find({ name: regExp }, (err, medicos) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(medicos);
                }
            });

        });
    }

    findUsers = (regExp: RegExp) => {
        return new Promise((resolve, reject) => {

            User.find({ name: regExp }, (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });

        });
    }

}

export default new SearchController();