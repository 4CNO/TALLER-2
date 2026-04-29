// __tests__/paises.test.js
// Pruebas automáticas del recurso País con Jest + Supertest

require('./setup');                 // carga mocks antes de todo
const request = require('supertest');
const app     = require('../app');
const bd      = require('../modelos/bd');

// ─── Utilidades ──────────────────────────────────────────────────
/** Crea un país de prueba y devuelve su id */
async function crearPaisPrueba(overrides = {}) {
  const payload = {
    nombre:      'TestPais',
    continente:  'Europa',
    tipoRegion:  'Comunidades',
    codigoAlfa2: 'TP',
    codigoAlfa3: 'TST',
    ...overrides,
  };
  const res = await request(app).post('/paises/agregar').send(payload);
  return res.body.datos?._id?.toString();
}

// ─── Limpieza entre tests ────────────────────────────────────────
beforeEach(() => {
  bd._reset();
});

// ════════════════════════════════════════════════════════════════
// GET /
// ════════════════════════════════════════════════════════════════
describe('GET /', () => {
  test('responde Hola Mundo con 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hola Mundo');
  });
});

// ════════════════════════════════════════════════════════════════
// GET /paises
// ════════════════════════════════════════════════════════════════
describe('GET /paises', () => {
  test('devuelve lista vacía inicialmente', async () => {
    const res = await request(app).get('/paises');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.datos).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  test('devuelve los países insertados', async () => {
    await crearPaisPrueba({ nombre: 'Alpha' });
    await crearPaisPrueba({ nombre: 'Beta', codigoAlfa2: 'BE', codigoAlfa3: 'BET' });
    const res = await request(app).get('/paises');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.datos.map(p => p.nombre)).toEqual(expect.arrayContaining(['Alpha', 'Beta']));
  });
});

// ════════════════════════════════════════════════════════════════
// POST /paises/agregar
// ════════════════════════════════════════════════════════════════
describe('POST /paises/agregar', () => {
  const payload = {
    nombre:      'Colombia',
    continente:  'América',
    tipoRegion:  'Departamentos',
    codigoAlfa2: 'CO',
    codigoAlfa3: 'COL',
  };

  test('crea un país correctamente → 201', async () => {
    const res = await request(app).post('/paises/agregar').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.datos.nombre).toBe('Colombia');
    expect(res.body.datos.codigoAlfa2).toBe('CO');
    expect(res.body.datos.regiones).toEqual([]);
  });

  test('normaliza códigos a mayúsculas', async () => {
    const res = await request(app).post('/paises/agregar').send({
      ...payload, codigoAlfa2: 'co', codigoAlfa3: 'col',
    });
    expect(res.body.datos.codigoAlfa2).toBe('CO');
    expect(res.body.datos.codigoAlfa3).toBe('COL');
  });

  test('falta campo → 400', async () => {
    const { nombre, ...sinNombre } = payload;
    const res = await request(app).post('/paises/agregar').send(sinNombre);
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test('codigoAlfa2 con longitud incorrecta → 400', async () => {
    const res = await request(app).post('/paises/agregar').send({ ...payload, codigoAlfa2: 'COL' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/codigoAlfa2/);
  });

  test('codigoAlfa3 con longitud incorrecta → 400', async () => {
    const res = await request(app).post('/paises/agregar').send({ ...payload, codigoAlfa3: 'CO' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/codigoAlfa3/);
  });
});

// ════════════════════════════════════════════════════════════════
// POST /paises/modificar
// ════════════════════════════════════════════════════════════════
describe('POST /paises/modificar', () => {
  test('modifica el nombre de un país existente → 200', async () => {
    const id  = await crearPaisPrueba();
    const res = await request(app).post('/paises/modificar').send({ id, nombre: 'NuevoNombre' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('sin id → 400', async () => {
    const res = await request(app).post('/paises/modificar').send({ nombre: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/id/i);
  });

  test('id con formato inválido → 400', async () => {
    const res = await request(app).post('/paises/modificar').send({ id: 'noesunobjectid', nombre: 'X' });
    expect(res.status).toBe(400);
  });

  test('id inexistente → 404', async () => {
    const res = await request(app).post('/paises/modificar').send({
      id: '000000000000000000000001',
      nombre: 'Fantasma',
    });
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// DELETE /paises/:id
// ════════════════════════════════════════════════════════════════
describe('DELETE /paises/:id', () => {
  test('elimina un país existente → 200', async () => {
    const id  = await crearPaisPrueba();
    const res = await request(app).delete(`/paises/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('id inválido → 400', async () => {
    const res = await request(app).delete('/paises/id-invalido');
    expect(res.status).toBe(400);
  });

  test('id inexistente → 404', async () => {
    const res = await request(app).delete('/paises/000000000000000000000001');
    expect(res.status).toBe(404);
  });
});

// ════════════════════════════════════════════════════════════════
// Ruta no encontrada
// ════════════════════════════════════════════════════════════════
describe('Ruta no encontrada', () => {
  test('rutas desconocidas devuelven 404 JSON', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});
