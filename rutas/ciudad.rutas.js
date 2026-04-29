// rutas/ciudad.rutas.js
// Definición de endpoints para el recurso Ciudad
// FIX BUG-008: rutas estáticas registradas ANTES que las dinámicas
// para evitar que /:idPais/:nombreRegion capture /agregar y /modificar

const express           = require('express');
const router            = express.Router();
const ciudadControlador  = require('../controladores/ciudad.controlador');

// ── Rutas estáticas (deben ir primero) ──────────────────────────

// POST /ciudades/agregar/:idPais/:nombreRegion → agregar ciudad
router.post('/agregar/:idPais/:nombreRegion', ciudadControlador.agregar);

// POST /ciudades/modificar/:idPais/:nombreRegion → modificar ciudad
router.post('/modificar/:idPais/:nombreRegion', ciudadControlador.modificar);

// ── Rutas dinámicas (van después) ───────────────────────────────

// GET /ciudades/:idPais/:nombreRegion → listar ciudades de una región
router.get('/:idPais/:nombreRegion', ciudadControlador.listar);

// DELETE /ciudades/:idPais/:nombreRegion/:nombreCiudad → eliminar ciudad
router.delete('/:idPais/:nombreRegion/:nombreCiudad', ciudadControlador.eliminar);

module.exports = router;
