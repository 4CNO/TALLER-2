// app.js
// Punto de entrada de la aplicación

const express = require('express');
const { conectar } = require('./modelos/bd');

// Importar rutas
const paisRutas    = require('./rutas/pais.rutas');
const regionRutas  = require('./rutas/region.rutas');
const ciudadRutas  = require('./rutas/ciudad.rutas');

const app = express();
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
async function iniciar() {
  try {
    await conectar();
    app.listen(PUERTO, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

iniciar();
