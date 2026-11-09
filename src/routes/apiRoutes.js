import { Router } from 'express';

/*
 * Rutas de la API
 * estas rutas vienen todas desde /api
 */
const router = Router();



router.get('/health', (req, res) => {
  res.json(
    {
      status: 'ok',
      message: "API funcional",
      port: process.env.PORT || 3000,
      process: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    }
  );
});

export default router;
