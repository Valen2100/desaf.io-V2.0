import { getTemplate, addLinkToHead } from "../../../utils/general";

export function loadRegisterCard(objectiveClassName) {
  const url = new URL('./register-card.html', import.meta.url).href;
  const templateId = "register-card-template";

  // Se obtiene el contenedor del register card en el DOM
  const registerCardContainer = document.querySelector(objectiveClassName ?? ".auth-container");
  if (!registerCardContainer) {
    console.error("No se encontro el contenedor del register card");
    return;
  }

  return getTemplate(url, templateId)
    .then(template => {
      const clone = document.importNode(template.content, true);
      addLinkToHead(template, url);
      registerCardContainer.appendChild(clone);
    }).catch(error => {
      console.error("Error al cargar el template del register card:", error);
    }
    );
}
