import { EXPIRATION_MS } from "../services/jwtService.js";

export const isProd = process.env.NODE_ENV === 'production';

export const SESSION_COOKIE = "token"; //nombre de la cookie

export const cookiesOptions = Object.freeze({
  httpOnly: true, // el navegador no puede acceder a la cookie desde JS (evita robo de cookies)
  secure: isProd, // solo se manda la cookie por https (evita lectura de cookies en redes inseguras)
  sameSite: 'strict', // el navegador no manda cookies a otros dominios, solo al mismo dominio (evita CSRF Cross Site Request Forgery)
  maxAge: EXPIRATION_MS, // expiracion del token
  path: '/', // la cookie se manda a todas las rutas del dominio
});
