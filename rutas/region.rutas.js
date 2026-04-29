// rutas/region.rutas.js
// Definición de endpoints para el recurso Región
// FIX BUG-007: rutas estáticas registradas ANTES que las dinámicas
// para evitar que Express interprete "agregar" o "modificar" como :idPais

const express          = require('express');
const router           = express.Router();
const regionControlador = require('../controladores/region.controlador');

// ── Rutas estáticas (deben ir primero) ──────────────────────────

// POST /regiones/agregar/:idPais → agregar región a un país
router.post('/agregar/:idPais', regionControlador.agregar);

// POST /regiones/modificar/:idPais → modificar región de un país
router.post('/modificar/:idPais', regionControlador.modificar);

// ── Rutas dinámicas (van después) ───────────────────────────────

// GET /regiones/:idPais → listar regiones de un país
router.get('/:idPais', regionControlador.listar);

// DELETE /regiones/:idPais/:nombreRegion → eliminar región
router.delete('/:idPais/:nombreRegion', regionControlador.eliminar);

module.exports = router;
