import { getTemplate, addLinkToHead } from "../../../utils/general.js";

export function loadPlayerCards(objectiveClassName) {

  const leaderboardList = document.querySelector(objectiveClassName ?? ".leaderboard-list");
  if (!leaderboardList) {
    throw new Error(`No se encontró el elemento con classname: ${objectiveClassName}`);
  }

  const players = getPlayerData(); // Fetch player data from the server (copilot vendepatria)
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
    li.querySelector('a').href = "/profile?player=" + encodeURIComponent(player.name);
    //se asigna el li al leaderboard
    leaderboardList.appendChild(li);
  });
}

function getPlayerData() {
  // Simulación de datos de jugadores (en un caso real, estos datos podrían provenir de una API o base de datos)
  const getImgUrl = (file) => new URL(`../../../imagenes/${file}`, import.meta.url).href;
  return [
    { name: 'Jugador 1', score: 1500, img: getImgUrl('imagen-perfil-1.png'), rank: 1 },
    { name: 'Jugador 2', score: 1200, img: getImgUrl('imagen-perfil-2.png'), rank: 2 },
    { name: 'Jugador 3', score: 900, img: getImgUrl('imagen-perfil-3.png'), rank: 3 },
    { name: 'Jugador 4', score: 800, img: getImgUrl('imagen-perfil-1.png'), rank: 4 },
    { name: 'Jugador 5', score: 700, img: getImgUrl('imagen-perfil-1.png'), rank: 5 },
  ];
}
