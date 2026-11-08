import { getTemplate, addLinkToHead } from '../../utils/general.js';

/**
 * Carga el template del leaderboard y lo agrega al contenedor correspondiente en el DOM.
 * También agrega el stylesheet del template al head del documento.
 * Si ocurre algún error durante la carga del template, se muestra un mensaje de error en la consola.
 * Solo pensado para cargar la estructura del leaderboard pero los jugadores deben
 * ser cargados con un script aparte para el desafio especifico (asi reutilizamos el template y el script).
 */
export function loadLeaderboard(objectiveClassName) {
  const url = new URL('./leaderboard.html', import.meta.url).href;
  const templateId = 'leaderboard-template';

  // Se obtiene el contenedor del leaderboard en el DOM
  const leaderboardContainer = document.querySelector(objectiveClassName ?? '.leaderboard-container');
  // aca no seria:             document.getElementsByClassName('.leaderboard-container')?
  if (!leaderboardContainer) {
    console.error('No se encontró el contenedor del leaderboard');
    return;
  }

  return getTemplate(url, templateId)
    .then(template => {
      // Agrega el link al head del documento para cargar el stylesheet del template
      addLinkToHead(template, url);

      // Se clona el contenido del template y se agrega al contenedor del leaderboard
      const clone = document.importNode(template.content, true);
      leaderboardContainer.appendChild(clone);
    })
    .catch(error => {
      console.error('Error al cargar el template del leaderboard:', error);
    }
    );
}



