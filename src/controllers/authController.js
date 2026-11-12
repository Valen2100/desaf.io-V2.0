//import { loginService, registerService, jwtService } from '../services/authService.js';
//import { }

function loginController(req, res) {
  let payload = [];

  const { username, password } = req.body ?? {};
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Los campos deben ser un string' });
  }

  loginService(username, password);
}

function registerController(req, res) {
  const { username, password } = req.body ?? {};
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Los campos deben ser un string' });
  }

  //maneja la logica de registro y devuelve un objeto con username y error.
  const user = registerService(username, password);
  if (user.error) {
    return res.status(400).json({ message: user.error });
  }

  const token = jwtService(user.id, user.username);

}

/**
 * compone la respuesta del auth controller.
 * @param {Object} user - El objeto de usuario. {id:int, username:string}
 * @param {string} token - El token JWT generado.
 * TODO: fijate en el estado de error
 * @returns {Object} - Respuesta HTTP con el estado y el mensaje correspondientes
 */
function composeResponse(user, token, status) {
  if (error) {
    return res.status(400).json({ message: error });
  }

  res.status(200).json({ user, token });
}
