# División Política API

API REST en Node.js + Express + MongoDB para gestión de países, regiones y ciudades.

---

## 🚀 Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MongoDB

# 3. Arrancar en desarrollo (con hot-reload)
npm run dev

# 4. Arrancar en producción
npm start
```

---

## 🧪 Pruebas automáticas (Jest + Supertest)

Las pruebas están **completamente mockeadas** — no necesitan conexión real a MongoDB.

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con output detallado
npm run test:v
```

### Cobertura de tests incluidos

| Archivo | Tests |
|---------|-------|
| `paises.test.js`  | 14 casos — CRUD completo + validaciones |
| `regiones.test.js`| 12 casos — CRUD completo + validaciones |
| `ciudades.test.js`| 11 casos — CRUD completo + validaciones |

---

## 📬 Colección Postman

Importar el archivo `DivisionPoliticaAPI.postman_collection.json` en Postman.

**Variables de colección:**
| Variable | Valor inicial |
|----------|--------------|
| `base_url` | `http://localhost:3000` |
| `id_pais`  | Se llena automáticamente al crear un país |
| `nombre_region` | `Antioquia` |
| `nombre_ciudad` | `Medellín` |

**Flujo de prueba recomendado:**
1. `POST /paises/agregar` → guarda `id_pais` automáticamente
2. `POST /regiones/agregar/{{id_pais}}`
3. `POST /ciudades/agregar/{{id_pais}}/{{nombre_region}}`
4. Probar GET, modificar y eliminar en orden

---

## 📁 Estructura del proyecto

```
/configuracion
  bd.config.js          ← URL y nombre de BD desde .env
/modelos
  bd.js                 ← Conexión MongoDB reutilizable
  pais.modelo.js        ← CRUD colección "paises"
  region.modelo.js      ← CRUD subdocumentos región
  ciudad.modelo.js      ← CRUD subdocumentos ciudad
/controladores
  pais.controlador.js   ← Lógica HTTP para países
  region.controlador.js ← Lógica HTTP para regiones
  ciudad.controlador.js ← Lógica HTTP para ciudades
/rutas
  pais.rutas.js         ← Endpoints /paises
  region.rutas.js       ← Endpoints /regiones
  ciudad.rutas.js       ← Endpoints /ciudades
/__tests__
  setup.js              ← Mock de MongoDB para Jest
  paises.test.js
  regiones.test.js
  ciudades.test.js
app.js                  ← Entry point
.env                    ← Variables de entorno (NO subir a git)
```

---

## 🌐 Endpoints

### Países
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/paises` | Listar todos |
| POST | `/paises/agregar` | Crear |
| POST | `/paises/modificar` | Actualizar (body: `{id, ...campos}`) |
| DELETE | `/paises/:id` | Eliminar |

### Regiones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/regiones/:idPais` | Listar regiones del país |
| POST | `/regiones/agregar/:idPais` | Agregar región |
| POST | `/regiones/modificar/:idPais` | Modificar región (body: `{nombreRegion, ...}`) |
| DELETE | `/regiones/:idPais/:nombreRegion` | Eliminar región |

### Ciudades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ciudades/:idPais/:nombreRegion` | Listar ciudades |
| POST | `/ciudades/agregar/:idPais/:nombreRegion` | Agregar ciudad |
| POST | `/ciudades/modificar/:idPais/:nombreRegion` | Modificar ciudad (body: `{nombreCiudad, ...}`) |
| DELETE | `/ciudades/:idPais/:nombreRegion/:nombreCiudad` | Eliminar ciudad |

---

## 🐛 Bugs corregidos

Ver `BUGS_REPORT.md` para el detalle completo de los 9 bugs encontrados y corregidos.
