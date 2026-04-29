// controladores/ciudad.controlador.js
// Lógica de negocio para el recurso Ciudad
// FIX BUG-001: require('../TALLER #2/modelos/...') → require('../modelos/...')

const ciudadModelo = require('../modelos/ciudad.modelo');
const { ObjectId } = require('mongodb');

/**
 * GET /ciudades/:idPais/:nombreRegion
 * Lista todas las ciudades de una región.
 */
async function listar(req, res) {
  try {
    const { idPais, nombreRegion } = req.params;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    const ciudades = await ciudadModelo.obtenerPorRegion(idPais, nombreRegion);

    if (ciudades === null) {
      return res.status(404).json({ ok: false, mensaje: 'País o región no encontrado' });
    }

    res.json({ ok: true, total: ciudades.length, datos: ciudades });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener ciudades', error: error.message });
  }
}

/**
 * POST /ciudades/agregar/:idPais/:nombreRegion
 * Agrega una ciudad a una región.
 * Body: { nombre, capitalRegion?, capitalPais? }
 */
async function agregar(req, res) {
  try {
    const { idPais, nombreRegion } = req.params;
    const { nombre, capitalRegion = false, capitalPais = false } = req.body;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    if (!nombre) {
      return res.status(400).json({ ok: false, mensaje: 'El campo "nombre" es requerido' });
    }

    const { resultado, ciudad } = await ciudadModelo.agregar(idPais, nombreRegion, {
      nombre,
      capitalRegion,
      capitalPais,
    });

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País o región no encontrado' });
    }

    res.status(201).json({ ok: true, mensaje: 'Ciudad agregada exitosamente', datos: ciudad });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al agregar ciudad', error: error.message });
  }
}

/**
 * POST /ciudades/modificar/:idPais/:nombreRegion
 * Modifica una ciudad dentro de una región.
 * Body: { nombreCiudad, nuevoNombre?, capitalRegion?, capitalPais? }
 */
async function modificar(req, res) {
  try {
    const { idPais, nombreRegion } = req.params;
    const { nombreCiudad, ...datos } = req.body;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    if (!nombreCiudad) {
      return res.status(400).json({ ok: false, mensaje: 'El campo "nombreCiudad" es requerido' });
    }

    const resultado = await ciudadModelo.actualizar(idPais, nombreRegion, nombreCiudad, datos);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País, región o ciudad no encontrada' });
    }

    res.json({ ok: true, mensaje: 'Ciudad actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al modificar ciudad', error: error.message });
  }
}

/**
 * DELETE /ciudades/:idPais/:nombreRegion/:nombreCiudad
 * Elimina una ciudad de una región.
 */
async function eliminar(req, res) {
  try {
    const { idPais, nombreRegion, nombreCiudad } = req.params;

    if (!ObjectId.isValid(idPais)) {
      return res.status(400).json({ ok: false, mensaje: 'El idPais proporcionado no es válido' });
    }

    const resultado = await ciudadModelo.eliminar(idPais, nombreRegion, nombreCiudad);

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País, región o ciudad no encontrada' });
    }

    res.json({ ok: true, mensaje: 'Ciudad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar ciudad', error: error.message });
  }
}

module.exports = { listar, agregar, modificar, eliminar };
