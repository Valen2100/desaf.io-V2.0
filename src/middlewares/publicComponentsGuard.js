/*
 * funcion que verifica el origen de la solicitud para evitar que se acceda a los componentes directamente desde el navegador
 * si la solicitud viene desde el navegador (se cambio la url para buscar la ruta de un componente) se devuelve un error 403
 * si viene de un fetch o de un script se permite el acceso
 * realmente se puede acceder si modifican los headers de la solicitud, pero da igual es solo html y css.
 * mas que nada esta para que no quede feo en el navegador cuando se accede a un componente directamente
 */
export default function originVerification(req, res, next) {
  // Rutas que no permiten acceso directo desde el navegador
  const noUrlAccessRoutes = [
    '/components',
    '/utils',
    '/css',
    '/html',
    '/imagenes'
  ]
  // Verificar si la ruta de la solicitud coincide con alguna de las rutas que no permiten acceso directo
  if (noUrlAccessRoutes.some(route => req.url.startsWith(route))) {
    const dest = req.get('sec-fetch-dest');
    const mode = req.get('sec-fetch-mode');
    // verifica el header de la solicitud
    if (!dest || dest == 'document' || !mode || mode == 'navigate') {
      return res.status(403).send('Forbidden');
    }
  }
  // Si la solictud viene del fetch, continua con la siguiente funcion.
  next();

}


