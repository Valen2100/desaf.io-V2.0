const games = [];
let nextId = 1;

const seedGames = [
  { challengeId: 1, userId: 1, score: 1500 }, // fede, top de la tabla
  { challengeId: 1, userId: 3, score: 1200 }, // valen
  { challengeId: 1, userId: 2, score: 900 }, // juan
  { challengeId: 1, userId: 4, score: 800 }, // sofi
  { challengeId: 1, userId: 5, score: 700 }, // nico
];

export function addSeedGames() {
  if (games.length > 0) return games.length;
  for (const seed of seedGames) addGame(seed);
  return games.length;
}

export function getGameById(id) {
  const game = games.find(game => game.id === id);

  return game || null;
}

export function addGame(game) {
  const newGame = {
    id: nextId++,
    challengeId: game.challengeId,
    userId: game.userId,
    score: game.score,
    playedAt: new Date().toISOString(),

  };
  games.push(newGame);
  return { ...newGame };
}

export function getGamesByChallengeId(challengeId, { from, cantidad }) {
  const gamesByChallenge = games
    .filter(game => game.challengeId === challengeId)
    .sort((a, b) => b.score - a.score || a.id - b.id);

  return {
    games: gamesByChallenge.slice(from, from + cantidad),
    total: gamesByChallenge.length,
  };
}


