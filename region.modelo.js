// modelos/region.modelo.js
// Acceso a datos de regiones (subdocumentos dentro de países)

const { obtenerBaseDatos } = require('./bd');
const { ObjectId } = require('mongodb');

const COLECCION = 'paises';

/**
 * Retorna todas las regiones de un país.
 * @param {string} idPais
 */
async function obtenerPorPais(idPais) {
  const db = obtenerBaseDatos();
  const pais = await db.collection(COLECCION).findOne(
    { _id: new ObjectId(idPais) },
    { projection: { regiones: 1, nombre: 1 } }
  );
  return pais ? pais.regiones : null;
}

/**
 * Agrega una región a un país.
 * @param {string} idPais
 * @param {Object} region - { nombre, area, poblacion }
 */
async function agregar(idPais, region) {
  const db = obtenerBaseDatos();
  const nueva = {
    nombre: region.nombre,
    area: Number(region.area),
    poblacion: Number(region.poblacion),
    ciudades: [],
  };
  const resultado = await db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais) },
    { $push: { regiones: nueva } }
  );
  return { resultado, region: nueva };
}

/**
 * Modifica una región dentro de un país (búsqueda por nombre).
 * @param {string} idPais
 * @param {string} nombreRegion
 * @param {Object} datos - campos a actualizar
 */
async function actualizar(idPais, nombreRegion, datos) {
  const db = obtenerBaseDatos();

  const campos = {};
  if (datos.nuevoNombre !== undefined) campos['regiones.$.nombre']    = datos.nuevoNombre;
  if (datos.area        !== undefined) campos['regiones.$.area']      = Number(datos.area);
  if (datos.poblacion   !== undefined) campos['regiones.$.poblacion'] = Number(datos.poblacion);

  return db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais), 'regiones.nombre': nombreRegion },
    { $set: campos }
  );
}

/**
 * Elimina una región de un país por nombre.
 * @param {string} idPais
 * @param {string} nombreRegion
 */
async function eliminar(idPais, nombreRegion) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais) },
    { $pull: { regiones: { nombre: nombreRegion } } }
  );
}

module.exports = { obtenerPorPais, agregar, actualizar, eliminar };
