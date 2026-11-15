import { HttpError } from "../http/HttpError";

export function createUser(id, username, password) {
  if (!id || !username || !password) {
    throw new HttpError('BAD_REQUEST', { message: 'Faltan parámetros para crear el usuario', details: { id, username, password } });
  }



}
