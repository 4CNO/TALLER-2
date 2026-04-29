# 🐛 Reporte de Bugs — QA Tester + Senior Backend

## Resumen ejecutivo
Se detectaron **9 bugs críticos** que impiden que el proyecto arranque, más
**3 mejoras** de calidad de código.

---

## 🔴 Bugs Críticos (bloquean ejecución)

### BUG-001 · Rutas de require incorrectas en los 3 controladores
**Archivos:** `controladores/pais.controlador.js`, `region.controlador.js`, `ciudad.controlador.js`
```js
// ❌ Antes — ruta fantasma que no existe
const paisModelo = require('../TALLER #2/modelos/pais.modelo');

// ✅ Después
const paisModelo = require('../modelos/pais.modelo');
```
**Impacto:** `MODULE_NOT_FOUND` al arrancar → servidor no inicia.

---

### BUG-002 · `bd.js` ubicado en raíz en vez de `/modelos/`
**Archivo:** `bd.js`  
`app.js` hace `require('./modelos/bd')` pero el archivo físico está en la raíz.  
**Fix:** Mover `bd.js` → `modelos/bd.js`.

---

### BUG-003 · Rutas de require incorrectas en los 3 modelos
**Archivos:** `modelos/pais.modelo.js`, `region.modelo.js`, `ciudad.modelo.js`
```js
// ❌ Antes — sube dos niveles, sale del proyecto
const { obtenerBaseDatos } = require('../bd');

// ✅ Después — bd.js está en la misma carpeta /modelos/
const { obtenerBaseDatos } = require('./bd');
```

---

### BUG-004 · `configuracion/bd.config` vacío
El archivo `configuracion/bd.config` existe pero está **vacío**.  
El contenido real está en `bd.config.js` (raíz) y nunca se coloca en
`configuracion/bd.config.js`.  
**Fix:** Crear `configuracion/bd.config.js` con el contenido correcto.

---

### BUG-005 · `.env` no se carga — `dotenv` ausente
`bd.config.js` usa `process.env.MONGO_URL` pero `dotenv` no está instalado
ni se invoca `require('dotenv').config()`.  
**Impacto:** `MONGO_URL` es `undefined` → conexión falla con URI inválida.

---

### BUG-006 · API obsoleta `cliente.topology.isConnected()`
**Archivo:** `modelos/bd.js`
```js
// ❌ Eliminado en mongodb driver v5+
if (cliente && cliente.topology && cliente.topology.isConnected())

// ✅ Usar flag propio
if (cliente && baseDatos)
```

---

### BUG-007 · Conflicto de rutas en Express — `/agregar` vs `/:idPais`
**Archivo:** `rutas/region.rutas.js`
```
POST /regiones/agregar/:idPais
GET  /regiones/:idPais          ← Express interpreta "agregar" como :idPais
```
**Fix:** Registrar rutas estáticas ANTES que rutas dinámicas (ya correcto en
el archivo de rutas, pero debe validarse el orden en app.js).

---

### BUG-008 · Ciudad: ruta dinámica oculta rutas estáticas
**Archivo:** `rutas/ciudad.rutas.js`
```
GET /:idPais/:nombreRegion       ← captura /agregar y /modificar
POST /agregar/:idPais/:nombreRegion
```
**Fix:** Registrar `/agregar` y `/modificar` antes del `/:idPais/:nombreRegion`.

---

### BUG-009 · `app.js` requiere `'./modelos/bd'` pero invoca `{ conectar }`
El módulo exporta `{ conectar, obtenerBaseDatos }` — ok. Pero si la ruta es
incorrecta (BUG-002) todo falla en cascada.

---

## 🟡 Mejoras de calidad

| # | Descripción |
|---|-------------|
| M-01 | Agregar `dotenv` a `package.json` y cargarlo en `app.js` |
| M-02 | Agregar scripts de test con Jest + Supertest |
| M-03 | Manejo de señales `SIGTERM`/`SIGINT` para cerrar conexión MongoDB limpiamente |
