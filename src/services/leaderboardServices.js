import { getGamesByChallengeId } from '../repository/gameHistoryRepository.js';
import { getUserById } from '../repository/userRepository.js';

export function getLeaderboard(challengeId, { from, cantidad }) {
  const { games, total } = getGamesByChallengeId(challengeId, { from, cantidad });

  const leaderboard = games.map(game => {
    const user = getUserById(game.userId);
    return {
      user: user ?? { id: game.userId, username: "usuario eliminado" },
      score: game.score,
      playedAt: game.playedAt,
      gameId: game.id,
    };
  });

  return { challengeId, leaderboard, total, from, cantidad };
}

