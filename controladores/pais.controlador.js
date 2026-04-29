// controladores/pais.controlador.js
// Lógica de negocio para el recurso País

const paisModelo = require('../../modelos/pais.modelo');
const { ObjectId } = require('mongodb');

/**
 * GET /paises
 * Lista todos los países.
 */
async function listar(req, res) {
  try {
    const paises = await paisModelo.obtenerTodos();
    res.json({ ok: true, total: paises.length, datos: paises });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener países', error: error.message });
  }
}

/**
 * POST /paises/agregar
 * Agrega un nuevo país.
 * Body: { nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3 }
 */
async function agregar(req, res) {
  try {
    const { nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3 } = req.body;

    // Validación de campos requeridos
    if (!nombre || !continente || !tipoRegion || !codigoAlfa2 || !codigoAlfa3) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos requeridos: nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3',
      });
    }

    if (codigoAlfa2.length !== 2) {
      return res.status(400).json({ ok: false, mensaje: 'codigoAlfa2 debe tener exactamente 2 caracteres' });
    }

    if (codigoAlfa3.length !== 3) {
      return res.status(400).json({ ok: false, mensaje: 'codigoAlfa3 debe tener exactamente 3 caracteres' });
    }

    const nuevo = await paisModelo.insertar({ nombre, continente, tipoRegion, codigoAlfa2, codigoAlfa3 });
    res.status(201).json({ ok: true, mensaje: 'País agregado exitosamente', datos: nuevo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al agregar país', error: error.message });
  }
}

/**
 * POST /paises/modificar
 * Modifica un país existente.
 * Body: { id, nombre?, continente?, tipoRegion?, codigoAlfa2?, codigoAlfa3? }
 */
async function modificar(req, res) {
  try {
    const { id, ...datos } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El campo "id" es requerido' });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, mensaje: 'El id proporcionado no es válido' });
    }

    if (datos.codigoAlfa2 && datos.codigoAlfa2.length !== 2) {
      return res.status(400).json({ ok: false, mensaje: 'codigoAlfa2 debe tener exactamente 2 caracteres' });
    }

    if (datos.codigoAlfa3 && datos.codigoAlfa3.length !== 3) {
      return res.status(400).json({ ok: false, mensaje: 'codigoAlfa3 debe tener exactamente 3 caracteres' });
    }

    const resultado = await paisModelo.actualizar(id, datos);

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País no encontrado' });
    }

    res.json({ ok: true, mensaje: 'País actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al modificar país', error: error.message });
  }
}

/**
 * DELETE /paises/:id
 * Elimina un país por su id.
 */
async function eliminar(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, mensaje: 'El id proporcionado no es válido' });
    }

    const resultado = await paisModelo.eliminar(id);

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'País no encontrado' });
    }

    res.json({ ok: true, mensaje: 'País eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar país', error: error.message });
  }
}

module.exports = { listar, agregar, modificar, eliminar };
