import { HttpError } from '../http/HttpError.js';

const MAX_CANTIDAD = 100;
const DEFAULT_CANTIDAD = 10;
const DEFAULT_FROM = 0;

export function validateChallengeId(challengeId) {
  const intRegex = /^[0-9]\d*$/;
  const intChallengeId = Number(challengeId);
  if (!intRegex.test(challengeId) || !Number.isSafeInteger(intChallengeId) || intChallengeId <= 0) {
    throw new HttpError('VALIDATION',
      { message: 'El id del desafío debe ser un número entero positivo' });
  }
  return intChallengeId;
}

export function validateMultiple(query = {}) {
  const cantidad = parseQueryInt(query.cantidad, 'cantidad', DEFAULT_CANTIDAD, 1, MAX_CANTIDAD);
  const from = parseQueryInt(query.from, 'from', DEFAULT_FROM, 0, Number.MAX_SAFE_INTEGER);
  return { cantidad, from };

}

function parseQueryInt(value, field, defaultValue, min, max) {
  if (value === undefined) {
    return defaultValue;
  }

  const intValue = Array.isArray(value) ? value[0] : value; // por si llega como array
  const intRegex = /^[0-9]\d*$/; //mover a una const
  const parsedValue = Number(intValue);

  if (!intRegex.test(intValue) || !Number.isSafeInteger(parsedValue) || parsedValue < min || parsedValue > max) {
    throw new HttpError('VALIDATION', { message: `El parámetro ${field} debe ser un número entero entre ${min} y ${max}` });
  }

  return parsedValue;
}


