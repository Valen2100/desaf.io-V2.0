import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();


// get /api/challenges/:idChall/leaderboard?cantidad=10&from=0
router.get('/:idChall/leaderboard', getLeaderboard);

export default router;
