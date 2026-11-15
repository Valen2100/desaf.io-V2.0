//import { loginService, registerService, jwtService } from '../services/authService.js';
//import { }

function loginController(req, res) {
  let payload = [];

  const { username, password } = req.body ?? {};


  loginService(username, password);
}

function registerController(req, res) {
  const { username, password } = req.body ?? {};

}
