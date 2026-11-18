import { HttpError } from "../http/HttpError.js";
import {
  getUser as getUserService,
  deleteUser as deleteUserService,
  updateUser as updateUserService
} from "../services/userService.js";

export function getUser(req, res, next) {
  try {
    res.json(getUserService(req.auth.id, req.params.id, undefined));

  } catch (err) {
    next(err);
  }
}

export function deleteUser(req, res, next) {
  try {
    res.json(deleteUserService(req.auth.id, req.params.id, undefined));
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    res.json(await updateUserService(req.auth.id, req.params.id, { username, password }));
  } catch (err) {
    next(err);
  }
}

