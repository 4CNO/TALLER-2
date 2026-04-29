// modelos/pais.modelo.js
// Acceso a datos de la colección "paises"

const { obtenerBaseDatos } = require('../bd');
const { ObjectId } = require('mongodb');

const COLECCION = 'paises';

/**
 * Retorna todos los países de la base de datos.
 */
async function obtenerTodos() {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).find({}).toArray();
}

/**
 * Busca un país por su ObjectId.
 * @param {string} id
 */
async function obtenerPorId(id) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).findOne({ _id: new ObjectId(id) });
}

/**
 * Inserta un nuevo país.
 * @param {Object} pais - { nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3 }
 */
async function insertar(pais) {
  const db = obtenerBaseDatos();
  const nuevo = {
    nombre: pais.nombre,
    continente: pais.continente,
    tipoRegion: pais.tipoRegion,
    codigoAlfa2: pais.codigoAlfa2.toUpperCase(),
    codigoAlfa3: pais.codigoAlfa3.toUpperCase(),
    regiones: [],
  };
  const resultado = await db.collection(COLECCION).insertOne(nuevo);
  return { ...nuevo, _id: resultado.insertedId };
}

/**
 * Actualiza un país por su id.
 * @param {string} id
 * @param {Object} datos - campos a actualizar
 */
async function actualizar(id, datos) {
  const db = obtenerBaseDatos();

  // Preparar campos permitidos para actualizar
  const campos = {};
  if (datos.nombre)      campos.nombre      = datos.nombre;
  if (datos.continente)  campos.continente  = datos.continente;
  if (datos.tipoRegion)  campos.tipoRegion  = datos.tipoRegion;
  if (datos.codigoAlfa2) campos.codigoAlfa2 = datos.codigoAlfa2.toUpperCase();
  if (datos.codigoAlfa3) campos.codigoAlfa3 = datos.codigoAlfa3.toUpperCase();

  const resultado = await db.collection(COLECCION).updateOne(
    { _id: new ObjectId(id) },
    { $set: campos }
  );
  return resultado;
}

/**
 * Elimina un país por su id.
 * @param {string} id
 */
async function eliminar(id) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).deleteOne({ _id: new ObjectId(id) });
}

module.exports = { obtenerTodos, obtenerPorId, insertar, actualizar, eliminar };
