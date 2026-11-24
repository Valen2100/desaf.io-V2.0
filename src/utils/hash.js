import argon2 from 'argon2';
import { HttpError } from '../http/HttpError.js';

/**
 * Genera un hash seguro para un dato dado utilizando el algoritmo Argon2.
 * @param {string} data - El dato a hashear.
 * @returns {Promise<string>} - Retorna el hash generado.
 * @throws {HttpError} - Lanza un error HTTP si ocurre un problema durante el hashing. (sin mensaje)
 */
export async function hash(data) {
  try {
    const hashedData = await argon2.hash(data);
    return hashedData;
  }
  catch (err) {
    throw new HttpError('INTERNAL_SERVER_ERROR'); //sin mensaje (no hace falta dar este dato)
  }


}

/**
 * Verifica si un hash corresponde a un dato dado.
 * @param {string} data - El dato a verificar.
 * @param {string} hash - El hash con el que comparar.
 * @returns {Promise<boolean>} - Retorna true si el hash corresponde al dato, false en caso contrario.
 * @throws {HttpError} - Lanza un error HTTP si ocurre un problema durante la verificación. (sin mensaje)
 */
export async function verifyHash(data, hash) {
  try {
    return await argon2.verify(hash, data);
  } catch (err) {
    throw new HttpError('INTERNAL_SERVER_ERROR');
  }
}

const base64urlRegex = /^[A-Za-z0-9_-]+$/;

export function base64Encode(data) {
  return Buffer.from(data).toString('base64url');
}

export function base64Decode(data) {
  if (typeof data !== 'string') {
    throw new HttpError('VALIDATION', { message: 'El dato a decodificar debe ser una cadena de texto' });
  }

  if (!base64urlRegex.test(data)) {
    throw new HttpError('VALIDATION', { message: 'El dato a decodificar no es un string en base64url válido' });
  }
  //resulta que el buffer tira basura en la decodificación si el string no es un base64 valido
  const decodedb64 = Buffer.from(data, 'base64url');
  //por eso esta esta verificacion, si tira basura, falla
  if (decodedb64.toString('base64url') !== data) {
    throw new HttpError('VALIDATION', { message: 'El dato a decodificar no es un string en base64url válido' });
  }

  return decodedb64.toString();

}
