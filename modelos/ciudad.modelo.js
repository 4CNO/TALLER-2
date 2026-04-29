// modelos/ciudad.modelo.js
// Acceso a datos de ciudades (subdocumentos dentro de regiones)
// FIX BUG-003: require('../bd') → require('./bd')

const { obtenerBaseDatos } = require('./bd');
const { ObjectId }         = require('mongodb');

const COLECCION = 'paises';

/**
 * Retorna todas las ciudades de una región específica.
 * @param {string} idPais
 * @param {string} nombreRegion
 * @returns {Promise<Array|null>}
 */
async function obtenerPorRegion(idPais, nombreRegion) {
  const db        = obtenerBaseDatos();
  const resultado = await db.collection(COLECCION).findOne(
    { _id: new ObjectId(idPais), 'regiones.nombre': nombreRegion },
    { projection: { 'regiones.$': 1 } }
  );
  if (!resultado || !resultado.regiones || resultado.regiones.length === 0) return null;
  return resultado.regiones[0].ciudades;
}

/**
 * Agrega una ciudad a una región.
 * @param {string} idPais
 * @param {string} nombreRegion
 * @param {Object} ciudad - { nombre, capitalRegion, capitalPais }
 * @returns {Promise<{ resultado, ciudad }>}
 */
async function agregar(idPais, nombreRegion, ciudad) {
  const db    = obtenerBaseDatos();
  const nueva = {
    nombre:        ciudad.nombre,
    capitalRegion: Boolean(ciudad.capitalRegion),
    capitalPais:   Boolean(ciudad.capitalPais),
  };
  const resultado = await db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais), 'regiones.nombre': nombreRegion },
    { $push: { 'regiones.$.ciudades': nueva } }
  );
  return { resultado, ciudad: nueva };
}

/**
 * Modifica una ciudad dentro de una región.
 * Usa arrayFilters porque MongoDB no admite $ anidado en arrays de segundo nivel.
 * @param {string} idPais
 * @param {string} nombreRegion
 * @param {string} nombreCiudad
 * @param {Object} datos - campos a actualizar
 * @returns {Promise<UpdateResult>}
 */
async function actualizar(idPais, nombreRegion, nombreCiudad, datos) {
  const db     = obtenerBaseDatos();
  const campos = {};

  if (datos.nuevoNombre   !== undefined) campos['regiones.$[reg].ciudades.$[ciu].nombre']        = datos.nuevoNombre;
  if (datos.capitalRegion !== undefined) campos['regiones.$[reg].ciudades.$[ciu].capitalRegion']  = Boolean(datos.capitalRegion);
  if (datos.capitalPais   !== undefined) campos['regiones.$[reg].ciudades.$[ciu].capitalPais']    = Boolean(datos.capitalPais);

  return db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais) },
    { $set: campos },
    {
      arrayFilters: [
        { 'reg.nombre': nombreRegion },
        { 'ciu.nombre': nombreCiudad },
      ],
    }
  );
}

/**
 * Elimina una ciudad de una región.
 * @param {string} idPais
 * @param {string} nombreRegion
 * @param {string} nombreCiudad
 * @returns {Promise<UpdateResult>}
 */
async function eliminar(idPais, nombreRegion, nombreCiudad) {
  const db = obtenerBaseDatos();
  return db.collection(COLECCION).updateOne(
    { _id: new ObjectId(idPais) },
    { $pull: { 'regiones.$[reg].ciudades': { nombre: nombreCiudad } } },
    { arrayFilters: [{ 'reg.nombre': nombreRegion }] }
  );
}

module.exports = { obtenerPorRegion, agregar, actualizar, eliminar };
