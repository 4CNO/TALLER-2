// modelos/bd.js
// Módulo de conexión reutilizable a MongoDB
// FIX BUG-002: movido de raíz a /modelos/ para que app.js pueda hacer require('./modelos/bd')
// FIX BUG-006: eliminado cliente.topology.isConnected() obsoleto en driver v5+

const { MongoClient } = require('mongodb');
const configuracion   = require('../configuracion/bd.config');

let cliente    = null;
let baseDatos  = null;

/**
 * Conecta a MongoDB si aún no hay conexión activa.
 * @returns {Promise<MongoClient>}
 */
async function conectar() {
  // FIX BUG-006: la propiedad topology.isConnected() fue eliminada en mongodb v5.
  // Usamos un flag propio (baseDatos !== null) para detectar conexión activa.
  if (cliente && baseDatos) {
    return cliente;
  }

  try {
    cliente   = new MongoClient(configuracion.url);
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

/**
 * Cierra la conexión activa con MongoDB.
 * Útil para manejo de señales SIGTERM/SIGINT.
 */
async function cerrar() {
  if (cliente) {
    await cliente.close();
    cliente   = null;
    baseDatos = null;
    console.log('🔌 Conexión a MongoDB cerrada.');
  }
}

module.exports = { conectar, obtenerBaseDatos, cerrar };
