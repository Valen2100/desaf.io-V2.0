import { parse } from 'cookie';
import { HttpError } from "../http/HttpError.js";
import { verifyToken } from "../services/jwtService.js";
import { SESSION_COOKIE } from "../utils/cookiesOptions.js";
import { getUserById } from '../repository/userRepository.js';



export function authMiddleware(req, res, next) {
  const cookies = parse(req.headers.cookie ?? '');
  const token = cookies[SESSION_COOKIE];

  if (!token) {
    return next(new HttpError('UNAUTHORIZED', { message: 'No hay sesion activa' }));
  }

  try {
    req.auth = verifyToken(token);
  } catch (err) {
    const errorMessage = err.message === 'EXPIRED' ? 'Sesion expirada' : 'Token invalido';
    return next(new HttpError('UNAUTHORIZED', { message: errorMessage }));
  }

  //por si el usuario fue borrado de la base de datos mientras tenia una sesion activa
  //el token va a ser correcto (porque fue generado por nosotros) pero el usuario ya no exite.
  if (!getUserById(req.auth.id)) {
    return next(new HttpError('UNAUTHORIZED', { message: 'Usuario no encontrado' }));
  }
  return next();
}



