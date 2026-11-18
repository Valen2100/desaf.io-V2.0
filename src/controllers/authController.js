import { HttpError } from '../http/HttpError.js';
import { login as loginService, register as registerServices, issueSessionToken } from '../services/authService.js';
import { SESSION_COOKIE, cookiesOptions } from '../utils/cookiesOptions.js';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    const user = await loginService(username, password);
    res.cookie(SESSION_COOKIE, issueSessionToken(user), cookiesOptions);
    res.status(200).json({ id: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    const user = await registerServices(username, password);
    res.cookie(SESSION_COOKIE, issueSessionToken(user), cookiesOptions);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res, next) {
  try {
    res.clearCookie(SESSION_COOKIE, cookiesOptions);
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    next(err);
  }
}

export function me(req, res, next) {
  try {
    if (!req.auth) {
      throw new HttpError('UNAUTHORIZED', { message: 'No hay sesion activa' });
    }
    res.status(200).json({ id: req.auth.id, username: req.auth.username });
  } catch (err) {
    next(err);
  }
}
