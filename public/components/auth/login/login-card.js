import { getTemplate, addLinkToHead } from "../../../utils/general.js";

export function loadLoginCard(objectiveClassName) {
  const url = new URL('./login-card.html', import.meta.url).href;
  const templateId = "login-card-template";

  // Se obtiene el contenedor del login card en el DOM
  const loginCardContainer = document.querySelector(objectiveClassName ?? ".auth-container");
  if (!loginCardContainer) {
    console.error("No se encontro el contenedor del login card");
    return;
  }

  return getTemplate(url, templateId)
    .then(template => {
      const clone = document.importNode(template.content, true);
      addLinkToHead(template, url);
      loginCardContainer.appendChild(clone);
    }).catch(error => {
      console.error("Error al cargar el template del login card:", error);
    }
    );
}

function handleLoginFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const username = form.querySelector('#username').value.trim();
  const password = form.querySelector('#password').value.trim();

  try {
    // Aquí puedes agregar la lógica para enviar los datos al servidor 
  }


}
