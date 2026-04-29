// configuracion/bd.config.js
// Configuración central de la base de datos
// FIX BUG-004: archivo estaba vacío — se mueve aquí el contenido real
// FIX BUG-005: dotenv debe cargarse ANTES de leer process.env

require('dotenv').config();

const configuracion = {
  url:      process.env.MONGO_URL  || 'mongodb://localhost:27017',
  nombreBD: process.env.NOMBRE_BD  || 'division_politica',
};

module.exports = configuracion;
