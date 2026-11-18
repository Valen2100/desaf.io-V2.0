import { HttpError } from '../http/HttpError.js';
import { verifyHash } from '../utils/hash.js';
import { validateUsername } from '../utils/userValidations.js';
import { getUserByUsernameWithPassword } from '../repository/userRepository.js';
import { createUser } from './userService.js';
import { signSessionToken } from './jwtService.js';

export async function login(username, password) {
  // Validar el nombre de usuario
  const validatedUsername = validateUsername(username);

  if (typeof password !== 'string' || password.length === 0) {
    throw new HttpError('INVALID_CREDENTIALS');
  }

  const user = getUserByUsernameWithPassword(validatedUsername);

  if (!user) throw new HttpError('INVALID_CREDENTIALS');
  const matches = await verifyHash(password, user.password);
  if (!matches) throw new HttpError('INVALID_CREDENTIALS');
  return { id: user.id, username: user.username };
}

export async function register(username, password) {
  const newUser = await createUser(username, password);
  return { id: newUser.id, username: newUser.username };
}

export function issueSessionToken(user) {
  return signSessionToken(user);
}
