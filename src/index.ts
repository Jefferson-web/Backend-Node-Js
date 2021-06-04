import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import path from 'path';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import connectDB from './db';
import { CommonRoutesConfig } from './common/common.routes.config';
import UserRoutes from './routes/user.routes';
import AuthRoutes from './routes/auth.routes';
import HospitalRoutes from './routes/hospital.routes';
import MedicoRoutes from './routes/medico.routes';
import SearchRoutes from './routes/search.routes';
import UploadsRoutes from './routes/uploads';
import ImagesRoutes from './routes/images.routes';

var app: Application = express();

app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));


const server: http.Server = http.createServer(app);

connectDB();

app.use(function(req: Request, res: Response, next:NextFunction){
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
   next();
});

// Configuracion de rutas
const routes: Array<CommonRoutesConfig> = [];
routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new HospitalRoutes(app));
routes.push(new MedicoRoutes(app));
routes.push(new SearchRoutes(app));
routes.push(new UploadsRoutes(app));
routes.push(new ImagesRoutes(app));

server.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
    routes.forEach((routes: CommonRoutesConfig) => {
        console.log(`Routes configured for ${routes.getName()}`);
    })
});