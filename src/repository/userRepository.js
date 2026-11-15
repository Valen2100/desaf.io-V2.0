import { HttpError } from "../http/HttpError.js";
import argon2 from "argon2";


//asumiendo fake db
const users = [];

const hashPassword = async (password) => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  }
  catch (err) {
    throw new HttpError('INTERNAL_SERVER_ERROR', { message: 'Error al hashear la contraseña' });
  }
}
/**
 * funcion para crear un usuario
 * @param {Object} user - objeto con los datos del usuario {username, password}
 * @returns {Object} - objeto con los datos del usuario creado
 */
export async function createUser(user) {
  if (getUserByUsername(user.username)) {
    throw new HttpError('VALIDATION', { message: 'El usuario ya existe' });
  }
  const hashedPassword = await hashPassword(user.password);
  const newUser = { id: users.length + 1, username: user.username, password: hashedPassword };
  users.push(newUser);
  return { id: newUser.id, username: newUser.username };
}

function getUserByUsername(username) {
  const user = users.find(user => user.username === username);
  if (!user) {
    throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { username } });
  }
  return { id: user.id, username: user.username };
}



function getUserById(id) {
  const user = users.find(user => user.id === id);
  if (!user) {
    throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { id } });
  }
  return { id: user.id, username: user.username };
}


export function getUser(user) {
  if (user.id) {
    return getUserById(user.id);
  } else if (user.username) {
    return getUserByUsername(user.username);
  } else {
    throw new HttpError('VALIDATION', { message: 'Debe proporcionar un id o un username' });
  }
}


export function getMultipleUser(usersArray) {
  if (!Array.isArray(usersArray)) {
    throw new HttpError('VALIDATION', { message: 'Debe proporcionar un array de usuarios' });
  }
  const usersFound = usersArray.map(user => {
    const id = user.id;
    if (id) {
      return getUserById(id);
    } else {
      throw new HttpError('VALIDATION', { message: 'Debe proporcionar un id para cada usuario' });
    }
  });
  return usersFound;
}

export async function updateUser(newUser) {
  if (!newUser.id) {
    throw new HttpError('VALIDATION', { message: 'Debe proporcionar un id para actualizar el usuario' });
  }
  const user = getUserById(user.id);

  if (newUser.password) {
    user.password = await hashPassword(newUser.password);
  }

  user.username = newUser.username ?? user.username;
  user.id = newUser.id ?? user.id;
  return { id: user.id, username: user.username };
}

export function deleteUser(id) {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { id } });
  }
  users.splice(userIndex, 1);
  return { message: 'Usuario eliminado correctamente' };
}
