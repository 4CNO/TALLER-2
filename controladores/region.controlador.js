// controladores/region.controlador.js
// Lógica de negocio para el recurso Región
// FIX BUG-001: require('../TALLER #2/modelos/...') → require('../modelos/...')

const regionModelo = require('../modelos/region.modelo');
const { ObjectId } = require('mongodb');

/**
 * GET /regiones/:idPais
 * Lista todas las regiones de un país.
 */
async function listar(req, res) {
  try {
    const { idPais } = req.params;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    const regiones = await regionModelo.obtenerPorPais(idPais);

    if (regiones === null) {
      return res.status(404).json({ ok: false, mensaje: 'País no encontrado' });
    }

    res.json({ ok: true, total: regiones.length, datos: regiones });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener regiones', error: error.message });
  }
}

/**
 * POST /regiones/agregar/:idPais
 * Agrega una región a un país.
 * Body: { nombre, area, poblacion }
 */
async function agregar(req, res) {
  try {
    const { idPais } = req.params;
    const { nombre, area, poblacion } = req.body;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    if (!nombre || area === undefined || poblacion === undefined) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos requeridos: nombre, area, poblacion',
      });
    }

    if (isNaN(Number(area)) || isNaN(Number(poblacion))) {
      return res.status(400).json({ ok: false, mensaje: '"area" y "poblacion" deben ser números' });
    }

    const { resultado, region } = await regionModelo.agregar(idPais, { nombre, area, poblacion });

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País no encontrado' });
    }

    res.status(201).json({ ok: true, mensaje: 'Región agregada exitosamente', datos: region });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al agregar región', error: error.message });
  }
}

/**
 * POST /regiones/modificar/:idPais
 * Modifica una región dentro de un país.
 * Body: { nombreRegion, nuevoNombre?, area?, poblacion? }
 */
async function modificar(req, res) {
  try {
    const { idPais } = req.params;
    const { nombreRegion, ...datos } = req.body;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    if (!nombreRegion) {
      return res.status(400).json({ ok: false, mensaje: 'El campo "nombreRegion" es requerido' });
    }

    if (
      (datos.area      !== undefined && isNaN(Number(datos.area))) ||
      (datos.poblacion !== undefined && isNaN(Number(datos.poblacion)))
    ) {
      return res.status(400).json({ ok: false, mensaje: '"area" y "poblacion" deben ser números' });
    }

    const resultado = await regionModelo.actualizar(idPais, nombreRegion, datos);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País o región no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Región actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al modificar región', error: error.message });
  }
}

/**
 * DELETE /regiones/:idPais/:nombreRegion
 * Elimina una región de un país.
 */
async function eliminar(req, res) {
  try {
    const { idPais, nombreRegion } = req.params;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    const resultado = await regionModelo.eliminar(idPais, nombreRegion);

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País o región no encontrada' });
    }

    res.json({ ok: true, mensaje: 'Región eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar región', error: error.message });
  }
}

module.exports = { listar, agregar, modificar, eliminar };
