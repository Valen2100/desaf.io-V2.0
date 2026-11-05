/**
 * Scripts de utilidades generales para la pagina
 */


/**
 * Carga un template HTML desde un archivo externo y lo devuelve como un elemento de template.
 * @param {string} url - La URL del archivo HTML que contiene el template.
 * @param {string} templateId - El ID del elemento de template dentro del archivo HTML.
 * @returns {Promise<HTMLTemplateElement>} - Una promesa que se resuelve con el elemento de template cargado.
 */
export async function getTemplate(url, templateId) {

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al cargar template desde ${url}: ${res.status}`);
  }

  //obtiene el texto HTML del template en texto plano del archivo html
  const htmlText = await res.text();

  //formatea el texto HTML para que sea legible
  const document = new DOMParser().parseFromString(htmlText, "text/html");

  //obtiene el template del documento HTML
  const template = document.getElementById(templateId);

  //se valida que exista el template, si no existe se lanza un error
  if (!template) {
    throw new Error(`No se encontró el template con id ${templateId} en ${url}`);
  }

  //adivina adivinador
  return template;
}

function getTemplateStylesheet(template, url) {
  let templateStylesheet = null;
  if (!template || !template.getAttribute('data-stylesheet')) {
    console.log(`El template ${template} no tiene un atributo data-stylesheet, ignorando...`);;
  } else {
    let stylesheetName = template.getAttribute('data-stylesheet');
    // Se obtiene la URL base del documento actual para poder construir la URL completa del stylesheet (evita que siga el template.html y lo cambia por el css)
    templateStylesheet = new URL(stylesheetName, url);

  }
  return templateStylesheet;
}

/**
 * Agrega un link al head del documento para cargar el stylesheet del template.
 * @param {HTMLTemplateElement} template - El elemento de template que contiene el atributo data-stylesheet.
 */
export function addLinkToHead(template, url) {
  const baseUrl = new URL(url, window.location.href);
  const templateStylesheet = getTemplateStylesheet(template, baseUrl);
  if (!templateStylesheet) {
    console.error(`El template esta vacio`);
    return
  }

  // Siempre se debe agregar el link al head del documento, si no existe ya uno con el mismo href
  const objectiveHead = document.querySelector("head");
  if (!objectiveHead) {
    console.error("No se encontro el head en el dom");
    return
  }

  //verifica si ya existe un link con el mismo href, si no existe lo agrega
  if (!objectiveHead.querySelector(`link[href="${templateStylesheet.href}"]`)) {
    console.log("insertando link con stylesheet");
    objectiveHead.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${templateStylesheet.href}">`);
  }
}

