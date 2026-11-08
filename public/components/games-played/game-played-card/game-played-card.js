import { getTemplate, addLinkToHead } from "../../../utils/general.js";

export function loadGamesPlayedCard(objectiveClassName) {
  const url = new URL('./game-player-card.html', import.meta.url).href;
  const templateId = "game-played-card-template";

  // Se obtiene el contenedor del games played card en el DOM
  const gamesPlayedCardContainer = document.querySelector(objectiveClassName ?? ".games-played-list");
  if (!gamesPlayedCardContainer) {
    console.error("No se encontro el contenedor del games played card");
    return;
  }

  const gameHistory = getGameHistory();


  // Se obtiene el template del games played card y se agrega al contenedor correspondiente en el DOM
  // Tambien se agrega el stylesheet del template al head del documento
  // Si ocurre algun error durante la carga del template, se muestra un mensaje de error en la consola
  return getTemplate(url, templateId)
    .then(template => {
      // Agrega el link al head del documento para cargar el stylesheet del template
      addLinkToHead(template, url);

      addGamesDataToCard(gameHistory, template, gamesPlayedCardContainer);

    }).catch(error => {
      console.error("Error al cargar el template del games played card:", error);
    }
    );
}

function addGamesDataToCard(gameHistory, template, gamesPlayedCardContainer) {
  //se define el clon del template para poder reutilizarlo en cada jugador
  const clone = document.importNode(template.content, true);

  gameHistory.forEach(game => {
    console.log(`Agregando juego: ${game.name} con puntaje: ${game.score}`);
    const li = document.createElement('li');
    li.appendChild(clone.cloneNode(true));

    //se asigna a la tarjeta los datos del jugador
    li.querySelector('.stat-title').textContent = game.name;
    li.querySelector('.stat-type').textContent = game.type;
    li.querySelector('.stat-value').textContent = game.score;

    gamesPlayedCardContainer.appendChild(li);
  });

}

function getGameHistory() {
  return [
    { name: 'Juego 1', type: 'Tipo 1', score: 1500 },
    { name: 'Juego 2', type: 'Tipo 2', score: 1200 },
    { name: 'Juego 3', type: 'Tipo 3', score: 1800 },
    { name: 'Juego 4', type: 'Tipo 4', score: 900 },
    { name: 'Juego 5', type: 'Tipo 5', score: 2000 }
  ];
}
