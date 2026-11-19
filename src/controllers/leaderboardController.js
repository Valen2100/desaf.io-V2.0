import { validateChallengeId, validateMultiple } from '../utils/leaderboardValidations.js';
import { getLeaderboard as getLeaderboardService } from '../services/leaderboardServices.js';

export function getLeaderboard(req, res, next) {
  try {
    const challengeId = validateChallengeId(req.params.idChall);
    const { cantidad, from } = validateMultiple(req.query);

    res.json(getLeaderboardService(challengeId, { cantidad, from }));
  } catch (err) {
    next(err);
  }
}
