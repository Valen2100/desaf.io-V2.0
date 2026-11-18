import { HttpError } from "../http/HttpError.js";
import { addUser, getUserByUsername, getUserById, deleteUser as deleteUserRepo, updateUser as updateUserRepo } from "../repository/userRepository.js";
import { hash } from "../utils/hash.js";
import { validateUserId, validateUsername, validatePassword } from "../utils/userValidations.js";



export async function createUser(username, password) {
  // Validar el nombre de usuario
  const validatedUsername = validateUsername(username);
  if (getUserByUsername(validatedUsername)) {
    throw new HttpError('CONFLICT', { message: 'El nombre de usuario ya existe', details: { username } });
  }

  // Validar la contraseña
  const validatedPassword = validatePassword(password);

  // Hashear la contraseña
  const hashedPassword = await hash(validatedPassword);

  // Crear el usuario en la base de datos
  const newUser = addUser({ username: validatedUsername, password: hashedPassword });

  // aca deberia haber una validacion de que el usuario se creo correctamente, pero como no hay db no hace falta
  return newUser;

}


export function getUser(jwtId, id, username) {
  // Validar el ID del usuario (pensado para datos privados pero no hay nada privado por ahora)
  //const validatedSelfId = validateUserId(jwtId);

  if (id !== undefined && id !== null) {
    const validatedId = validateUserId(id);
    const user = getUserById(validatedId);
    if (!user) {
      throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { id } });
    }
    return user;
  }

  if (username !== undefined && username !== null) {
    const user = getUserByUsername(validateUsername(username));
    if (!user) {
      throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { username } });
    }
    return user;
  }

  throw new HttpError('VALIDATION', {
    message: 'Debe proporcionar un id o un username',
    details: { fields: ['id', 'username'] },
  });
}

export function deleteUser(jwtId, id) {
  const validatedId = validateUserId(id);
  const validatedSelfId = validateUserId(jwtId);

  // verifica que el usuario exista y que sea el mismo que el del token
  if (!getUserById(validatedId)) {
    throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { id } });
  } else if (validatedSelfId !== validatedId) {
    throw new HttpError('FORBIDDEN', { message: 'No puedes eliminar a otro usuario' });
  }

  // elimina el usuario (si bien el repo devuelve null, con la verificacion anterior no deberia pasar nunca)
  return deleteUserRepo(validatedId);
}

export async function updateUser(jwtId, newUsername, newPassword) {
  const validatedSelfId = validateUserId(jwtId);
  let hashedPassword;
  let validatedUsername;


  if (newUsername || newPassword) {
    if (newPassword) {
      const validatedPassword = validatePassword(newPassword);
      hashedPassword = await hash(validatedPassword);
    }

    if (newUsername) {
      validatedUsername = validateUsername(newUsername);
      const existingUser = getUserByUsername(validatedUsername);
      if (existingUser && existingUser.id !== jwtId) {
        throw new HttpError('CONFLICT', { message: 'El nombre de usuario ya existe', details: { username: newUsername } });
      }
    }

    const updatedUser = updateUserRepo(
      {
        id: validatedSelfId,
        username: validatedUsername,
        password: hashedPassword
      }
    );

    if (!updatedUser) {
      throw new HttpError('NOT_FOUND', { message: 'Usuario no encontrado', details: { jwtId } });
    }
    return updatedUser;
  } else {
    throw new HttpError('VALIDATION', {
      message: 'No hay campos que actualizar',
      details: { fields: ['username', 'password'] },
    });
  }


}

