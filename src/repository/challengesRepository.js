import { HttpError } from "../http/HttpError";

//tabla de desafíos 
const challenges = [
  //con data podriamos pasar la informacion de la generacion de laberintos en base64 asi la recibe correctamente y no tiene que generarlo el cliente
  { id: 1, type: "labyrinth", size: 16, avalible: true, data: null },
  { id: 2, type: "minesweeper", size: 16, avalible: true, data: null },
]

export function getAvalibleChallenges(challengeType) {

  switch (challengeType) {
    case "labyrinth":
      return getAvalibleLabyrinths();
    case "minesweeper":
      return getAvalibleMinesweepers();
    default:
      throw new HttpError('VALIDATION', { message: 'Tipo de desafío no válido' });
  }
}

function getAvalibleLabyrinths() {
  return labyrinths.filter(labyrinth => labyrinth.avalible);
}

function getAvalibleMinesweepers() {
  return minesweeper.filter(minesweeper => minesweeper.avalible);
}

export function getChallenge(id) {
  const challenge = challenges.find(challenge => challenge.id === id);
  if (!challenge) {
    throw new HttpError('NOT_FOUND', { message: 'Desafío no encontrado', details: { id } });
  }
  return challenge;
}

export function addChallenge(challenge) {
  if (!challenge.type || !challenge.size) {
    throw new HttpError('VALIDATION', { message: 'Debe proporcionar un tipo y un tamaño para el desafío' });
  }
  const newChallenge = {
    id: challenges.length + 1,
    type: challenge.type,
    size: challenge.size,
    avalible: true,
    data: null
  };
  challenges.push(newChallenge);
  return newChallenge;
}

export function deleteChallenge(id) {
  const challengeIndex = challenges.findIndex(challenge => challenge.id === id);
  if (challengeIndex === -1) {
    throw new HttpError('NOT_FOUND', { message: 'Desafío no encontrado', details: { id } });
  }
  challenges.splice(challengeIndex, 1);
  return { message: 'Desafío eliminado correctamente' };
}

export function updateChallenge(newChallenge) {
  if (!newChallenge.id) {
    throw new HttpError('VALIDATION', { message: 'Debe proporcionar un id para actualizar el desafío' });
  }

  const challenge = getChallenge(newChallenge.id);

  challenge.type = newChallenge.type ?? challenge.type;
  challenge.size = newChallenge.size ?? challenge.size;
  challenge.avalible = newChallenge.avalible ?? challenge.avalible;
  challenge.data = newChallenge.data ?? challenge.data;

  return challenge;
}
