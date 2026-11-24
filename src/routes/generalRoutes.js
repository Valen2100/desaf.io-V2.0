import express, { Router } from 'express';
import { join } from 'node:path';
import screenRouter from './screenRouter.js';
import publicComponentsGuard from '../middlewares/publicComponentsGuard.js';
import apiRoutes from './apiRoutes.js';

const router = Router();

//ruta a la api
router.use('/api', apiRoutes);

//middleware para proteger los componentes publicos
router.use(publicComponentsGuard);

// rutas a pantallas
router.use(screenRouter);

// ruta a la carpeta public para que se pueda acceder a los archivos estaticos
const publicPath = join(import.meta.dirname, '..', '..', 'public');
router.use("/", express.static(publicPath));


export default router;

