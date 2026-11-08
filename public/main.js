import { loadPlayerCards } from "./components/leaderboard/laberinto-player-card/leaderboard-player-card.js";
import { loadLeaderboard } from "./components/leaderboard/leaderboard.js";

await loadLeaderboard(".leaderboard-container").then(async () => {
  await loadPlayerCards();
});

