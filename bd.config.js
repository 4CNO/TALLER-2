// configuracion/bd.config.js
// Configuración central de la base de datos

const configuracion = {
  url: process.env.MONGO_URL || 'mongodb://localhost:27017',
  nombreBD: process.env.NOMBRE_BD || 'division_politica',
};

module.exports = configuracion;
