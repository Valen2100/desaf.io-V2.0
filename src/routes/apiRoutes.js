import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import challengeRoutes from './challengesRoutes.js';


/*
 * Rutas de la API
 * estas rutas vienen todas desde /api
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/challenges', challengeRoutes);

export default router;
