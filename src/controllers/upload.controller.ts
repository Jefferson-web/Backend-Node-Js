import { Request, Response } from 'express';
import User from '../models/user.schema';
import Hospital from '../models/hospital.schema';
import Medico from '../models/medico.schema';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UploadController {

    formatos = ['image/jpeg', 'image/png'];
    docPermitidos = ['users', 'hospitals', 'medicos'];

    uploadImage = (req: Request, res: Response) => {

        const { collection, id } = req.params;

        const form = new formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {

            if (err) {
                throw err;
            }

            const imagen: any = files["imagen"];
            const { name, path, type, size } = imagen;

            // El arhivo debe tener la extesion jpeg o png
            if (!this.formatos.includes(type)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Formato de archivo incorrecto',
                    errors: { message: `Solo se acepta archivos en formato ${this.formatos.join(', ')}` }
                });
            }

            // El archivo no debe sobrepasar los 2MB
            if (size > 2000000) {
                return res.status(400).json({
                    ok: false,
                    message: 'El archivo sobrepasa los 2MB'
                });
            }

            if (!this.docPermitidos.includes(collection)) {
                return res.status(400).json({
                    ok: false,
                    message: `La coleccion ${collection} no esta permitida`
                });
            }

            const { img, targetPath } = this.createTargetDirectory(collection, name);

            fs.readFile(path, (err, data) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error en lectura del archivo',
                        errors: err
                    });
                }

                fs.writeFile(targetPath, data, (err) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al subir la imagen',
                            errors: err
                        });
                    }

                    this.updateImage(collection, id, img, res);

                });

            });

        });

    };

    updateImage(collection: string, id: string, fileName: string, res: Response) {

        switch (collection) {
            case 'users':
                User.findById(id, (err: any, user: any) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Bad Request',
                            errors: err
                        });
                    }
                    if(!user){
                        return res.status(404).json({
                            ok: false,
                            message: `User with id ${id} not found`
                        });
                    }
                    const oldPath = `${this.uploads}/users/${user.img}`;
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                    user.img = fileName;
                    user.save((err: any, updatedUser: any) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar la imagen',
                                errors: err
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            message: 'Imagen actualizada',
                            user: updatedUser
                        });
                    });

                });
                break;
            case 'hospitals':
                Hospital.findById(id, (err: any, hospital: any) => {
                    if (err) {
                        return res.status(404).json({
                            ok: false,
                            message: 'Hospital Not Found',
                            errors: err
                        });
                    }
                    if(!hospital){
                        return res.status(404).json({
                            ok: false,
                            message: `hospital with id ${id} not found`
                        });
                    }
                    const oldPath = `${this.uploads}/hospitals/${hospital.img}`;
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                    hospital.img = fileName;
                    hospital.save((err: any, updatedHospital: any) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar la imagen',
                                errors: err
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            message: 'Imagen actualizada',
                            hospital: updatedHospital
                        });
                    });

                });
                break;
            case 'medicos':
                Medico.findById(id, (err: any, medico: any) => {
                    if (err) {
                        return res.status(404).json({
                            ok: false,
                            message: 'Medico Not Found',
                            errors: err
                        });
                    }
                    if(!medico){
                        return res.status(404).json({
                            ok: false,
                            message: `medico with id ${id} not found`
                        });
                    }
                    const oldPath = `${this.uploads}/medicos/${medico.img}`;
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                    medico.img = fileName;
                    medico.save((err: any, updatedMedico: any) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar la imagen',
                                errors: err
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            message: 'Imagen actualizada',
                            medico: updatedMedico
                        });
                    });

                });
                break;
            default:
                break;
        }

    }

    createTargetDirectory(subDir: string, fileName: string) {
        subDir = subDir.toLowerCase();
        const ext = path.extname(fileName);
        const targetDir = `${this.uploads}/${subDir}`;
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
        const name = `image-${uuidv4() + ext}`;
        const targetPath = targetDir + '/' + name;
        return {
            img: name,
            targetPath
        }
    }

    get uploads() {
        return path.join(__dirname, '../uploads');
    }

}

export default new UploadController();