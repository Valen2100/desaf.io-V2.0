import { httpCodes } from './status.js';

/*
 * Si se requiere un error, agregarlo aca
 * solo codigos de error
 * haria falta para codigos de exito? quien sabe
 * quizas el exito depende de quien lo vea
 * quizas un error para un usuario es un exito para otro
 * quizas un INTERNAL_SERVER_ERROR es un exito para un atacante
 * quizas un NOT_FOUND es un exito para quien quiere negar la verdad
 * quizas un FORBIDDEN es un exito para quien quiere proteger su privacidad
 * quizas un UNAUTHORIZED es un exito para quien quiere proteger su seguridad
 * quizas un BAD_REQUEST es un exito para quien quiere proteger su integridad
 * quizas un CONFLICT es un exito para quien quiere proteger su coherencia
 * quizas un METHOD_NOT_ALLOWED es un exito para quien quiere proteger su consistencia
 * TODO: borrar estos comentarios y escribir algo mas util
 */
export const ErrorCodes = Object.freeze({
  VALIDATION: { status: httpCodes.BAD_REQUEST, message: 'Datos invalidos' },
  UNAUTHORIZED: { status: httpCodes.UNAUTHORIZED, message: 'No autorizado, inicie sesión' },
  INVALID_CREDENTIALS: { status: httpCodes.UNAUTHORIZED, message: 'Credenciales inválidas' },
  FORBIDDEN: { status: httpCodes.FORBIDDEN, message: 'Prohibido, no tiene permisos para acceder a este recurso' },
  NOT_FOUND: { status: httpCodes.NOT_FOUND, message: 'Recurso no encontrado' },
  METHOD_NOT_ALLOWED: { status: httpCodes.METHOD_NOT_ALLOWED, message: 'Método no permitido' },
  CONFLICT: { status: httpCodes.CONFLICT, message: 'Conflicto, el recurso ya existe' },
  INTERNAL_SERVER_ERROR: { status: httpCodes.INTERNAL_SERVER_ERROR, message: 'Error interno del servidor' },
});
