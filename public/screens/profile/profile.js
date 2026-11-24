import { loadProfileCard } from "../components/profile-card/profile-card.js";
import { loadGamesPlayedList } from "../components/games-played/games-played-list.js";
import { loadGamesPlayedCard } from "../components/games-played/game-played-card/game-played-card.js";
import { loadLeaderboard } from "../components/leaderboard/leaderboard.js";
import { loadPlayerCards } from "../components/leaderboard/laberinto-player-card/leaderboard-player-card.js";




await loadProfileCard(".profile-header");
await loadGamesPlayedList(".profile-stats-container").then(() => {
  loadGamesPlayedCard();
})
await loadLeaderboard(".leaderboard-container").then(() => {
  loadPlayerCards();
})

