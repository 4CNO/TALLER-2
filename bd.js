// modelos/bd.js
// Módulo de conexión reutilizable a MongoDB

const { MongoClient } = require('mongodb');
const configuracion = require('../configuracion/bd.config');

let cliente = null;
let baseDatos = null;

/**
 * Conecta a MongoDB si aún no hay conexión activa.
 * @returns {Promise<MongoClient>}
 */
async function conectar() {
  if (cliente && cliente.topology && cliente.topology.isConnected()) {
    return cliente;
  }

  try {
    cliente = new MongoClient(configuracion.url);
    await cliente.connect();
    baseDatos = cliente.db(configuracion.nombreBD);
    console.log(`✅ Conectado a MongoDB → base de datos: "${configuracion.nombreBD}"`);
    return cliente;
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    throw error;
  }
}

/**
 * Retorna la instancia de la base de datos.
 * Lanza error si no se ha conectado previamente.
 * @returns {import('mongodb').Db}
 */
function obtenerBaseDatos() {
  if (!baseDatos) {
    throw new Error('Base de datos no inicializada. Llama a conectar() primero.');
  }
  return baseDatos;
}

module.exports = { conectar, obtenerBaseDatos };
