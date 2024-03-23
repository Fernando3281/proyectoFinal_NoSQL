//controller.js
const CuentasService = require('../service/cuentasService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { correo, contraseña } = req.body;
    const user = await CuentasService.findUserByEmail(correo);

    if (!user) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    // Obtener la información del usuario correctamente
    const userData = {
      correo: user.correo,
      nombre: user.nombre
      // Agrega más campos del usuario según sea necesario
    };

    // Firmar el token JWT con la información del usuario
    const token = jwt.sign(userData, 'secretoDelToken');

    return res.redirect(`/Inicio.html?`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

async function register(req, res) {
  try {
    const newUser = await CuentasService.registerUser(req.body);
    res.redirect('/Inicio.html');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}


module.exports = { register, login};