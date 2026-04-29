// modelos/pais.modelo.js
// Acceso a datos de la colección "paises"
// FIX BUG-003: require('../bd') → require('./bd')  (bd.js está en la misma carpeta /modelos/)

const { obtenerBaseDatos } = require('./bd');
const { ObjectId }         = require('mongodb');

const COLECCION = 'paises';

/**
 * Retorna todos los países de la base de datos.
 * @returns {Promise<Array>}
 */
async function obtenerTodos() {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).find({}).toArray();
}

/**
 * Busca un país por su ObjectId.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function obtenerPorId(id) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).findOne({ _id: new ObjectId(id) });
}

/**
 * Inserta un nuevo país.
 * @param {Object} pais - { nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3 }
 * @returns {Promise<Object>}
 */
async function insertar(pais) {
  const db    = obtenerBaseDatos();
  const nuevo = {
    nombre:       pais.nombre,
    continente:   pais.continente,
    tipoRegion:   pais.tipoRegion,
    codigoAlfa2:  pais.codigoAlfa2.toUpperCase(),
    codigoAlfa3:  pais.codigoAlfa3.toUpperCase(),
    regiones:     [],
  };
  const resultado = await db.collection(COLECCION).insertOne(nuevo);
  return { ...nuevo, _id: resultado.insertedId };
}

/**
 * Actualiza un país por su id.
 * @param {string} id
 * @param {Object} datos - campos a actualizar
 * @returns {Promise<UpdateResult>}
 */
async function actualizar(id, datos) {
  const db     = obtenerBaseDatos();
  const campos = {};

  if (datos.nombre)      campos.nombre      = datos.nombre;
  if (datos.continente)  campos.continente  = datos.continente;
  if (datos.tipoRegion)  campos.tipoRegion  = datos.tipoRegion;
  if (datos.codigoAlfa2) campos.codigoAlfa2 = datos.codigoAlfa2.toUpperCase();
  if (datos.codigoAlfa3) campos.codigoAlfa3 = datos.codigoAlfa3.toUpperCase();

  return db.collection(COLECCION).updateOne(
    { _id: new ObjectId(id) },
    { $set: campos }
  );
}

/**
 * Elimina un país por su id.
 * @param {string} id
 * @returns {Promise<DeleteResult>}
 */
async function eliminar(id) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).deleteOne({ _id: new ObjectId(id) });
}

module.exports = { obtenerTodos, obtenerPorId, insertar, actualizar, eliminar };
