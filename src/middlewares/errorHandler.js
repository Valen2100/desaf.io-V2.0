import { HttpError } from "../http/HttpError.js";
import { ErrorCodes } from "../http/errorCodes.js";

/**
 * Middleware de manejo de errores para Express.
 * Este middleware captura errores que ocurren en la aplicación y envía una respuesta HTTP adecuada.
 * @param {Error} err - El error que ocurrió.
 * @param {Request} req - El objeto de solicitud de Express
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {Function} next - La función next() de Express para pasar el control al siguiente middleware.
*/
//dato extra, si la funcion no tiene 4 parametros, express no la reconoce como middleware de error y no la ejecuta cuando hay un error
export default function errorHandler(err, req, res, next) {
  /*
   * si ocurre un error cuando ya se definio el header de la respuesta, 
   * no se puede enviar otra respuesta
   * por lo que se delega el error al siguiente middleware de error, 
   * osea el de express, que es el que envia la respuesta de error por defecto
   */
  if (res.headersSent) return next(err);



  // revision de si es error previsto o de js/express
  const isHttpError = err instanceof HttpError;
  const status = isHttpError ? err.status : ErrorCodes.INTERNAL_SERVER_ERROR.status;

  // log de error (evito loguear 400s y 404s, que son errores previstos)
  if (!isHttpError) console.error(`[${new Date().toISOString()}] ERROR: ${err.stack || err.message || err}`);

  // envio de respuesta de error
  res.status(status).json({
    error: {
      code: isHttpError ? err.code : 'INTERNAL_SERVER_ERROR',
      message: isHttpError ? err.message : ErrorCodes.INTERNAL_SERVER_ERROR.message,
      details: isHttpError ? err.details : undefined,
    },
  });
}
