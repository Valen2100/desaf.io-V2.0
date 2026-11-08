import express, { Router } from 'express';
import { join } from 'node:path';

const router = Router();

function originVerification(req, res, next) {
  const dest = req.get('sec-fetch-dest');
  const mode = req.get('sec-fetch-mode');
  if (!dest || dest == 'document' || !mode || mode == 'navigate') {
    return res.status(403).send('Forbidden');
  }
  next();
}

const publicRoute = join(import.meta.dirname, '..', '..', 'public');

const componentsPath = join(import.meta.dirname, '..', '..', 'public', 'components');
const utilsPath = join(import.meta.dirname, '..', '..', 'public', 'utils');

router.use(originVerification);
router.use(express.static(publicRoute));

export default router;
