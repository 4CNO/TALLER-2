// rutas/region.rutas.js
// Definición de endpoints para el recurso Región

const express = require('express');
const router = express.Router();
const regionControlador = require('../controladores/region.controlador');

// GET /regiones/:idPais → listar regiones de un país
router.get('/:idPais', regionControlador.listar);

// POST /regiones/agregar/:idPais → agregar región a un país
router.post('/agregar/:idPais', regionControlador.agregar);

// POST /regiones/modificar/:idPais → modificar región de un país
router.post('/modificar/:idPais', regionControlador.modificar);

// DELETE /regiones/:idPais/:nombreRegion → eliminar región
router.delete('/:idPais/:nombreRegion', regionControlador.eliminar);

module.exports = router;
