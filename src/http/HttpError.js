import { ErrorCodes } from './errorCodes.js';

export class HttpError extends Error {
  /**
   * Crea una instancia de HttpError.
   * Esta clase sirve para manejar errores HTTP y definir mensajes de error personalizados.
   * @param {string} code - el codigo de error.
   * @param {Object} [options] - detalles (puede ser un objeto, ej {fields: "username"}) .
   */
  constructor(code, { message, details } = {}) {
    const errorCode = ErrorCodes[code];
    if (!errorCode) {
      throw new TypeError(`Error code ${code} not found`);
    }

    // Llamar al constructor de la clase padre (Error) con el mensaje de error
    super(message ?? errorCode.message);

    // Se establecen las propiedades adicionales del error 
    this.name = 'HttpError'; // intercambia el default 'Error' por 'HttpError'
    this.code = code;
    this.status = errorCode.status;
    this.details = details; // por si queres un {field: "username"} o algo por el estilo
  }
}
