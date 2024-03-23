//service.js
const { getDatabase } = require('../repositories/conexionRepository');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const cuentasCollection = () => getDatabase().collection('cuentas');

async function registerUser(userData) {
  const { dia, mes, año } = userData;
  const fechaNacimiento = new Date(`${año}-${mes}-${dia}`);
  const edad = new Date().getFullYear() - año;

  // Hashear la contraseña antes de guardarla en la base de datos
  const hashedPassword = await bcrypt.hashSync(userData.contraseña, 10);

  const newUser = await cuentasCollection().insertOne({
    nombre: userData.nombre || '',
    apellido: userData.apellido || '',
    edad: edad || null,
    fechaNacimiento: fechaNacimiento || null,
    tipoCuenta: userData.tipoCuenta || '',
    genero: userData.genero || '',
    correo: userData.correo || '',
    numeroTelefono: userData.numeroTelefono || [],
    contraseña: hashedPassword, 
    idListaAmigos: userData.idListaAmigos || null,
    idCuentas: new ObjectId(),
  });

  return newUser;
}

async function findUserByEmail(correo) {
  return await cuentasCollection().findOne({ correo });
}

module.exports = { registerUser, findUserByEmail};
