import { loadProfileCard } from "../../components/profile-card/profile-card.js";
import { loadGamesPlayedList } from "../../components/games-played/games-played-list.js";
import { loadGamesPlayedCard } from "../../components/games-played/game-played-card/game-played-card.js";
import { loadLeaderboard } from "../../components/leaderboard/leaderboard.js";
import { loadPlayerCards } from "../../components/leaderboard/laberinto-player-card/leaderboard-player-card.js";

function getGameHistory(usuario) {
  return [
    { name: 'Juego 1', type: 'Tipo 1', score: 1500 },
    { name: 'Juego 2', type: 'Tipo 2', score: 1200 },
    { name: 'Juego 3', type: 'Tipo 3', score: 1800 },
    { name: 'Juego 4', type: 'Tipo 4', score: 900 },
    { name: 'Juego 5', type: 'Tipo 5', score: 2000 }
  ];
}


await loadProfileCard(".profile-header");
await loadGamesPlayedList(".profile-stats-container").then(() => {
  loadGamesPlayedCard(_, getGameHistory("usuario"));
})
await loadLeaderboard(".leaderboard-container").then(() => {
  loadPlayerCards();
})
