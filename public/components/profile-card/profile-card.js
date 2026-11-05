import { getTemplate, addLinkToHead } from '../../utils/general.js';

export function loadProfileCard(objectiveClassName) {
  const url = new URL('./profile-card.html', import.meta.url).href;
  const templateId = 'profile-card-template';

  // Se obtiene el contenedor del profile card en el DOM
  const profileCardContainer = document.querySelector(objectiveClassName ?? '.profile-card-container');
  if (!profileCardContainer) {
    console.error('No se encontró el contenedor del profile card');
    return;
  }

  // Se obtiene el template del profile card y se agrega al contenedor correspondiente en el DOM
  // Tambien se agrega el stylesheet del template al head del documento
  // Si ocurre algún error durante la carga del template, se muestra un mensaje de error en la consola
  return getTemplate(url, templateId)
    .then(template => {
      // Agrega el link al head del documento para cargar el stylesheet del template
      addLinkToHead(template, url);


      addPlayerDataToCard(getPlayerData(), template, profileCardContainer);
    })
    .catch(error => {
      console.error('Error al cargar el template del profile card:', error);
    });
}

function addPlayerDataToCard(player, template, profileCardContainer) {
  //se define el clon del template para poder reutilizarlo en cada jugador
  const clone = document.importNode(template.content, true);

  console.log(`Agregando jugador: ${player.name} con puntaje: ${player.score}`);
  //se asigna a la tarjeta los datos del jugador
  clone.querySelector('.profile-picture img').src = player.img;
  clone.querySelector('.profile-name').textContent = player.name;
  clone.querySelector('.xp-value-current').textContent = player.xpCurrent;
  clone.querySelector('.xp-value-max').textContent = player.xpMax;
  clone.querySelector('#nivel').value = player.xpCurrent;
  clone.querySelector('#nivel').max = player.xpMax;
  clone.querySelector('.level-container label').textContent = player.level;

  profileCardContainer.appendChild(clone);

}

function getPlayerData() {
  // Simulación de datos del jugador (en un caso real, estos datos podrían provenir de una API o base de datos)
  return {
    name: 'Jugador 1',
    img: new URL('../../imagenes/imagen-perfil-1.png', import.meta.url).href,
    xpCurrent: 1500,
    xpMax: 2000,
    level: 5
  };
}
