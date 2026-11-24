import { HttpError } from "../http/HttpError.js";
import {
  getUser as getUserService,
  deleteUser as deleteUserService,
  updateUser as updateUserService
} from "../services/userService.js";

function parseUserId(id) {
  const intRegex = /^[0-9]\d*$/;
  const intId = Number(id);
  if (!intRegex.test(id) || !Number.isInteger(intId)) {
    throw new HttpError('VALIDATION', { message: 'El id del usuario debe ser un número entero' });
  }
  return intId;
}

export function getUser(req, res, next) {
  try {
    const jwtid = req.auth?.id ?? 1; // Default to 1 if req.auth.id is undefined
    res.json(getUserService(jwtid, parseUserId(req.params.id), undefined));

  } catch (err) {
    next(err);
  }
}

export function deleteUser(req, res, next) {
  try {
    res.json(deleteUserService(req.auth.id, parseUserId(req.params.id), undefined));
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    res.json(await updateUserService(req.auth.id, username, password));
  } catch (err) {
    next(err);
  }
}

