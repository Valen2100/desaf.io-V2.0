import { parse } from 'cookie';
import { HttpError } from "../http/HttpError.js";
import { verifyToken } from "../services/jwtService.js";
import { SESSION_COOKIE } from "../utils/cookiesOptions.js";



export function authMiddleware(req, res, next) {
  const cookies = parse(req.headers.cookie ?? '');
  const token = cookies[SESSION_COOKIE];

  if (!token) {
    return next(new HttpError('UNAUTHORIZED', { message: 'No hay sesion activa' }));
  }

  try {
    req.auth = verifyToken(token);
    return next();
  } catch (err) {
    const errorMessage = err.message === 'EXPIRED' ? 'Sesion expirada' : 'Token invalido';
    return next(new HttpError('UNAUTHORIZED', { message: errorMessage }));
  }
}



