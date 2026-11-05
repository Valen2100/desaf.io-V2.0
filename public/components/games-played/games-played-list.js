import { getTemplate, addLinkToHead } from "../../utils/general.js";


//TODO: cambiar todo games-played a game-history, y cambiar el nombre de la funcion loadGamesPlayedCard a loadGameHistoryCard
//tambien cambiar el nombre de la carpeta y los archivos
export function loadGamesPlayedList(objectiveClassName) {
  const url = new URL('./games-played-list.html', import.meta.url).href;
  const templateId = "games-played-list-template";

  // Se obtiene el contenedor del games played card en el DOM
  const gamesPlayedListContainer = document.querySelector(objectiveClassName ?? ".games-played-list");
  if (!gamesPlayedListContainer) {
    console.error("No se encontro el contenedor del games played list");
    return;
  }

  return getTemplate(url, templateId)
    .then(template => {
      const clone = document.importNode(template.content, true);
      addLinkToHead(template, url);
      gamesPlayedListContainer.appendChild(clone);
    }).catch(error => {
      console.error("Error al cargar el template del games played list:", error);
    }
    );

}

