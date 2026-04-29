// app.js
// Punto de entrada de la aplicación
// FIX BUG-005: dotenv cargado al inicio para que process.env esté disponible
// FIX M-03: manejo de señales SIGTERM/SIGINT para cierre limpio

require('dotenv').config();

const express      = require('express');
const { conectar, cerrar } = require('./modelos/bd');

// Importar rutas
const paisRutas   = require('./rutas/pais.rutas');
const regionRutas = require('./rutas/region.rutas');
const ciudadRutas = require('./rutas/ciudad.rutas');

const app    = express();
const PUERTO = process.env.PUERTO || 3000;

// ─── Middlewares ────────────────────────────────────────────────
app.use(express.json());

// ─── Ruta raíz ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

// ─── Rutas de la API ────────────────────────────────────────────
app.use('/paises',   paisRutas);
app.use('/regiones', regionRutas);
app.use('/ciudades', ciudadRutas);

// ─── Manejo de rutas no encontradas ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta "${req.path}" no encontrada` });
});

// ─── Inicio del servidor ─────────────────────────────────────────
let servidor;

async function iniciar() {
  try {
    await conectar();
    servidor = app.listen(PUERTO, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

// FIX M-03: cierre limpio de conexión MongoDB al recibir señales del SO
async function cerrarServidor(señal) {
  console.log(`\n⚠️  Señal ${señal} recibida. Cerrando servidor...`);
  if (servidor) servidor.close();
  await cerrar();
  process.exit(0);
}

process.on('SIGTERM', () => cerrarServidor('SIGTERM'));
process.on('SIGINT',  () => cerrarServidor('SIGINT'));

iniciar();

// Exportar app para pruebas con Supertest (sin iniciar el servidor)
module.exports = app;
