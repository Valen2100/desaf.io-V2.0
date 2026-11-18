import { Router } from 'express';
import { getUser, deleteUser, updateUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;

