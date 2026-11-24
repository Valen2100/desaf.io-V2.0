import express, { Router } from 'express';
import { join } from 'node:path';

const router = Router();
const screensPath = join(import.meta.dirname, '..', '..', 'public', 'screens');
const publicPath = join(import.meta.dirname, '..', '..', 'public');

router.use('/', express.static(publicPath));
router.use('/profile', express.static(join(screensPath, 'profile')));
router.use('/desafio', express.static(join(screensPath, 'desafio')));


export default router;
