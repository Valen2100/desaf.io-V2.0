import { hash } from '../utils/hash.js';

//asumiendo fake db
const users = [];
let nextId = 1;

const seedUsers = [
  { username: 'fede', password: 'fede12345' },
  { username: 'juan', password: 'juan1234' },
  { username: 'valen', password: 'valen1234' },
  { username: 'fede2', password: 'fede123456' },
  { username: 'fede3', password: 'fede12345' },
];

//sirve como carga inicial de usuarios para pruebas, si ya existen no los agrega
export async function addSeedUsers() {
  for (const seed of seedUsers) {
    if (users.some(u => u.username === seed.username)) continue;
    users.push({ id: nextId++, username: seed.username, password: await hash(seed.password) });
  }
  return users.length;
}


/**
 * funcion para crear un usuario
 * asume que el service verifico todo y que este usuario es valido para crear
 * @param {Object} user - objeto con los datos del usuario {username, password}
 * @returns {Object} - objeto con los datos del usuario creado
 */
export function addUser(user) {
  const newUser = { id: nextId++, username: user.username, password: user.password };
  users.push(newUser);
  return { id: newUser.id, username: newUser.username };
}

export function getUserByUsername(username) {
  const user = users.find(user => user.username === username);
  return user ? { id: user.id, username: user.username } : null;
}



export function getUserById(id) {
  const user = users.find(user => user.id === id);

  return user ? { id: user.id, username: user.username } : null;
}

export function getUserByUsernameWithPassword(username) {
  const user = users.find(user => user.username === username);

  return user ? { ...user } : null;
}

function getUserByIdInternal(id) {
  const user = users.find(user => user.id === id);

  return user || null;
}

// export function getMultipleUser(usersArray) {
//   const usersFound = usersArray.map(user => {
//     const id = user.id;
//     if (id) {
//       return getUserById(id);
//     } else {
//       throw new HttpError('VALIDATION', { message: 'Debe proporcionar un id para cada usuario' });
//     }
//   });
//
//   return usersFound;
// }

export function updateUser(newUser) {
  const user = getUserByIdInternal(newUser.id);

  if (!user) {
    return null;
  }

  if (newUser.username) {
    user.username = newUser.username;
  }
  if (newUser.password) {
    user.password = newUser.password;
  }

  return { id: user.id, username: user.username };
}

export function deleteUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return null;
  }
  const deletedUser = users.splice(index, 1)[0];
  return { id: deletedUser.id, username: deletedUser.username };
}
