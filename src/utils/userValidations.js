import { HttpError } from "../http/HttpError.js";


/**
 * Este módulo contiene funciones de validación para los datos de usuario.
 * Se asegura de que los datos cumplan con los requisitos antes de ser procesados o almacenados.
 *
 * @module userValidations
 */

/**
 * Expresiones regulares y constantes para la validación de usuarios.
 */
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
const passwordMaxLength = 16;
const passwordMinLength = 8;

/**
 * Valida el ID del usuario asegurándose de que sea un número entero positivo.
 * @param {number} id - El ID del usuario a validar.
 * @returns {number} - El ID del usuario si es válido.
 * @throws {HttpError} - Si el ID no es un número entero positivo.
 */
export function validateUserId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new HttpError('VALIDATION', {
      message: 'El id del usuario debe ser un número entero positivo',
      details: { fields: ["id"] }
    });
  }

  return id;
}

/**
 * Valida el nombre de usuario según los criterios establecidos.
 * @param {string} username - El nombre de usuario a validar.
 * @returns {string} - El nombre de usuario normalizado si es válido.
 * @throws {HttpError} - Si el nombre de usuario no cumple con los criterios.
 */
export function validateUsername(username) {
  if (typeof username !== 'string') {
    throw new HttpError('VALIDATION', {
      message: 'El nombre de usuario debe ser una cadena no vacía',
      details: { fields: ["username"] }
    });
  }

  /* Normalizar el nombre de usuario para evitar problemas con caracteres especiales
  * resulta que en ciertos sistemas operativos (ej: MacOS) los caracteres con acentos se representan en NFD (Normal Form Decomposed)
  * y en otros sistemas operativos (ej: Windows, Linux) se representan en NFC (Normal Form Composed)
  * puede representar josé como jose\u0301 (jose + acento) y en otros como josé
  * si evaluas jose\u0301 === josé, el resultado es false, por lo que la normalizacion fuerza a que ambos sean iguales
  * al pedo? un poco pero bueno.
  */
  const normalizedUsername = username.trim().normalize('NFC');

  if (!usernameRegex.test(normalizedUsername)) {
    throw new HttpError('VALIDATION', {
      message: 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números y guiones bajos'
      , details: { fields: ["username"] }
    });
  }

  return normalizedUsername;
}


/**
 * Valida la contraseña asegurándose de que cumpla con los requisitos de longitud.
 * @param {string} password - La contraseña a validar.
 * @returns {string} - La contraseña si es válida.
 * @throws {HttpError} - Si la contraseña no cumple con los requisitos de longitud.
 */
export function validatePassword(password) {
  if (typeof password !== 'string') {
    throw new HttpError('VALIDATION', { message: 'La contraseña debe ser una cadena de texto', details: { password } });
  }

  const passwordLength = [...password].length; // Contar caracteres Unicode correctamente

  if (passwordLength < passwordMinLength || passwordLength > passwordMaxLength) {
    throw new HttpError('VALIDATION', {
      message: `La contraseña debe tener entre ${passwordMinLength} y ${passwordMaxLength} caracteres`,
      details: { fields: ["password"] }
    });
  }

  return password;
}
