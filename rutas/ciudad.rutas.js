// rutas/ciudad.rutas.js
// Definición de endpoints para el recurso Ciudad

const express = require('express');
const router = express.Router();
const ciudadControlador = require('../controladores/ciudad.controlador');

// GET /ciudades/:idPais/:nombreRegion → listar ciudades de una región
router.get('/:idPais/:nombreRegion', ciudadControlador.listar);

// POST /ciudades/agregar/:idPais/:nombreRegion → agregar ciudad
router.post('/agregar/:idPais/:nombreRegion', ciudadControlador.agregar);

// POST /ciudades/modificar/:idPais/:nombreRegion → modificar ciudad
router.post('/modificar/:idPais/:nombreRegion', ciudadControlador.modificar);

// DELETE /ciudades/:idPais/:nombreRegion/:nombreCiudad → eliminar ciudad
router.delete('/:idPais/:nombreRegion/:nombreCiudad', ciudadControlador.eliminar);

module.exports = router;
