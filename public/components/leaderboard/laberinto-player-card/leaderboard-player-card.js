import { getTemplate, addLinkToHead } from "../../../utils/general.js";

const AVATARS = ['imagen-perfil-1.png', 'imagen-perfil-2.png', 'imagen-perfil-3.png'];
const DEFAULT_CHALLENGE_ID = 1; // ID del desafío por defecto

export async function loadPlayerCards(objectiveClassName) {

  const leaderboardList = document.querySelector(objectiveClassName ?? ".leaderboard-list");
  if (!leaderboardList) {
    throw new Error(`No se encontró el elemento con classname: ${objectiveClassName}`);
  }

  const players = await getPlayerData(); //fetch a api
  if (!players || players.length === 0) {
    console.error('No se encontraron jugadores para mostrar en el leaderboard');
    return;
  }

  const url = new URL('./leaderboard-player-card.html', import.meta.url).href;
  const templateId = 'leaderboard-player-card-template';

  return getTemplate(
    url,
    templateId
  ).then(template => {
    // Agrega el link al head del documento para cargar el stylesheet del template
    console.log('Template del leaderboard player card cargado, agregando link al head del documento');
    addLinkToHead(template, url);
    // Agrega las tarjetas de los jugadores al leaderboard
    console.log('Agregando tarjetas de jugadores al leaderboard');
    addPlayerCards(players, template, leaderboardList);

  }).catch(error => {
    console.error('Error al cargar el template del leaderboard player card:', error);
  });

}

function addPlayerCards(players, template, leaderboardList) {
  //se define el clon del template para poder reutilizarlo en cada jugador
  const clone = document.importNode(template.content, true);

  players.forEach(player => {
    console.log(`Agregando jugador: ${player.name} con puntaje: ${player.score}`);
    //se crea un elemento li para cada jugador
    const li = document.createElement('li');
    //copia profunda del template para cada jugador
    li.appendChild(clone.cloneNode(true));
    //se asigna a la tarjeta los datos del jugador
    li.querySelector('.leaderboard-player-name').textContent = player.name;
    li.querySelector('.leaderboard-player-statistics strong').textContent = player.score;
    li.querySelector('.leaderboard-player-rank').textContent = player.rank;
    li.querySelector('.avatar').src = player.img;
    li.querySelector('a').href = "/profile?player=" + encodeURIComponent(player.id);
    //se asigna el li al leaderboard
    leaderboardList.appendChild(li);
  });
}

async function getPlayerData(challengeId = DEFAULT_CHALLENGE_ID, cantidad = 10, from = 0) {
  const getImgUrl = (file) => new URL(`../../../imagenes/${file}`, import.meta.url).href;

  const res = await fetch(`/api/challenges/${challengeId}/leaderboard?cantidad=${cantidad}&from=${from}`,
    {
      credentials: "same-origin",
    });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error al pedir el leaderboard:', err.error?.message ?? res.status);
    return [];
  }

  const { leaderboard, from: fromIndex } = await res.json();

  return leaderboard.map((item, index) => ({
    id: item.user.id,
    name: item.user.username,
    score: item.score,
    rank: fromIndex + index + 1,
    img: getImgUrl(AVATARS[(item.user.id - 1) % AVATARS.length]),
  }));
}
