// rutas/pais.rutas.js
// Definición de endpoints para el recurso País

const express        = require('express');
const router         = express.Router();
const paisControlador = require('../controladores/pais.controlador');

// GET /paises → listar todos los países
router.get('/', paisControlador.listar);

// POST /paises/agregar → crear un nuevo país
// ORDEN: rutas estáticas ANTES que dinámicas (buena práctica)
router.post('/agregar', paisControlador.agregar);

// POST /paises/modificar → actualizar un país existente
router.post('/modificar', paisControlador.modificar);

// DELETE /paises/:id → eliminar un país por id
router.delete('/:id', paisControlador.eliminar);

module.exports = router;
