import {Request, Response} from 'express';
import path from 'path';
import fs from 'fs';

export class ImagesController{

    findImage = (req: Request, res: Response) => {
        const {tipo, img} = req.params;
        const pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
        if(fs.existsSync(pathImage)){
            res.sendFile(pathImage);
        } else {
            const pathNoImage = path.resolve(__dirname, '../assets/no-image-available.jpg');
            res.sendFile(pathNoImage);
        }
    } 

}

export default new ImagesController();