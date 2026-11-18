import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('JWT_SECRET no definido en .env');
}

//algoritmo usado en jwt
const ALGORITHM = 'HS256';
//const de expiracion del token en segundos y milisegundos
const EXPIRATION_SEC = 15 * 60; // 15 minutos en segundos
const EXPIRATION_MS = EXPIRATION_SEC * 1000; // 15 minutos en milisegundos
// issuer para saber quien emitio el token
const ISSUER = "desaf.io";
// audience para saber a quien va dirigido el token (en este caso a la pagina de desaf.io)
const AUDIENCE = "desaf.io-web";

export function signSessionToken(user) {
  return jwt.sign(
    /*resulta que el estandar pide que el campo de id sea sub para que sea identificable el usuario del token
    mando id como string para que no haya problemas con numeros grandes y username para que el front pueda mostrarlo*/
    { sub: String(user.id), username: user.username },
    SECRET,
    { algorithm: ALGORITHM, expiresIn: EXPIRATION_SEC, issuer: ISSUER, audience: AUDIENCE }
  );
}

export function verifyToken(token) {
  let payload;
  try {
    payload = jwt.verify(
      token,
      SECRET,
      {
        algorithms: [ALGORITHM],
        issuer: ISSUER,
        audience: AUDIENCE
      }
    );
  } catch (err) {
    throw new Error(err.name === 'TokenExpiredError' ? 'EXPIRED' : 'INVALID');
  }
  const userId = Number(payload.sub); //lo devuelvo a numero
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error('INVALID');
  }
  return { id: userId, username: payload.username };
}

export { EXPIRATION_SEC, EXPIRATION_MS, ISSUER, AUDIENCE };
