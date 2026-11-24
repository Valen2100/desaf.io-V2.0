import { Router } from 'express';
import { getUser, deleteUser, updateUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();


router.get('/:id', getUser);

router.use(authMiddleware);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;

