import { HttpError } from "../http/HttpError";

/*
 * posible estructura de la tabla
 * [
 *  { id: 1, userId: 1, challengeId: 1, score: 100, date: '${fecha}', metadata: {type: "labyrinth", size: 16, time: 60, moves: 20 } },
 *  { id: 2, userId: 1, challengeId: 2, score: 200, date: '${fecha}', metadata: {type: "minesweeper", size: 16, time: 120 } },
 * ]
 * fecha a definir formato
 */

const gameHistory = [];

export function addGameHistory(game) {

  const newGame = {
    id: gameHistory.length + 1,
    userId: game.userId,
    challengeId: game.challengeId,
    score: game.score,
    date: game.date,
    metadata: game.metadata
  };
  gameHistory.push(newGame);

  return newGame;
}

export function getGameHistoryByUserId(userId) {
  const userGameHistory = gameHistory.filter(game => game.userId === userId);
  if (userGameHistory.length === 0) {
    throw new HttpError('NOT_FOUND', { message: 'Historial de juegos no encontrado para el usuario', details: { userId } });
  }
  return userGameHistory;
}

export function getGameHistoryByChallengeId(challengeId) {
  const challengeGameHistory = gameHistory.filter(game => game.challengeId === challengeId);
  if (challengeGameHistory.length === 0) {
    throw new HttpError('NOT_FOUND', { message: 'Historial de juegos no encontrado para el desafío', details: { challengeId } });
  }
  return challengeGameHistory;
}

export function getCompleteGameHistory() {
  if (gameHistory.length === 0) {
    throw new HttpError('NOT_FOUND', { message: 'No hay historial de juegos disponible' });
  }
  return gameHistory;
}

