import { HttpError } from "../http/HttpError";

/*
 * posible estructura de la tabla
 * [
 *  { id: 1, userId: 1, challengeId: 1, score: 100, date: '${fecha}', metadata: {type: "labyrinth", size: 16, time: 60, moves: 20 } },
 *  { id: 2, userId: 1, challengeId: 2, score: 200, date: '${fecha}', metadata: {type: "minesweeper", size: 16, time: 120 } },
 * ]
 * fecha a definir formato
 */
*/
const gameHistory = [];

export function addGameHistory(game) {

