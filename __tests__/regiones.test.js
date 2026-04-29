// __tests__/regiones.test.js
// Pruebas automáticas del recurso Región con Jest + Supertest

require('./setup');
const request = require('supertest');
const app     = require('../app');
const bd      = require('../modelos/bd');

// ─── Utilidades ──────────────────────────────────────────────────
async function crearPais() {
  const res = await request(app).post('/paises/agregar').send({
    nombre: 'PaisTest', continente: 'América', tipoRegion: 'Estados',
    codigoAlfa2: 'PT', codigoAlfa3: 'PTS',
  });
  return res.body.datos._id.toString();
}

async function crearRegion(idPais, nombre = 'RegionTest') {
  await request(app).post(`/regiones/agregar/${idPais}`).send({
    nombre, area: 100000, poblacion: 5000000,
  });
}

beforeEach(() => { bd._reset(); });

// ════════════════════════════════════════════════════════════════
// GET /regiones/:idPais
// ════════════════════════════════════════════════════════════════
describe('GET /regiones/:idPais', () => {
  test('devuelve array vacío para país sin regiones', async () => {
    const id  = await crearPais();
    const res = await request(app).get(`/regiones/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.datos).toEqual([]);
  });

  test('id inválido → 400', async () => {
    const res = await request(app).get('/regiones/id-invalido');
    expect(res.status).toBe(400);
  });

  test('país inexistente → 404', async () => {
    const res = await request(app).get('/regiones/000000000000000000000001');
    expect(res.status).toBe(404);
  });
});

// ════════════════════════════════════════════════════════════════
// POST /regiones/agregar/:idPais
// ════════════════════════════════════════════════════════════════
describe('POST /regiones/agregar/:idPais', () => {
  test('agrega una región correctamente → 201', async () => {
    const id  = await crearPais();
    const res = await request(app).post(`/regiones/agregar/${id}`).send({
      nombre: 'Antioquia', area: 63612, poblacion: 6800000,
    });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.datos.nombre).toBe('Antioquia');
    expect(res.body.datos.ciudades).toEqual([]);
  });

  test('convierte area y poblacion a Number', async () => {
    const id  = await crearPais();
    const res = await request(app).post(`/regiones/agregar/${id}`).send({
      nombre: 'Valle', area: '22000', poblacion: '4500000',
    });
    expect(typeof res.body.datos.area).toBe('number');
    expect(typeof res.body.datos.poblacion).toBe('number');
  });

  test('campos faltantes → 400', async () => {
    const id  = await crearPais();
    const res = await request(app).post(`/regiones/agregar/${id}`).send({ nombre: 'Solo' });
    expect(res.status).toBe(400);
  });

  test('área no numérica → 400', async () => {
    const id  = await crearPais();
    const res = await request(app).post(`/regiones/agregar/${id}`).send({
      nombre: 'X', area: 'abc', poblacion: 100,
    });
    expect(res.status).toBe(400);
  });

  test('id de país inválido → 400', async () => {
    const res = await request(app).post('/regiones/agregar/novalido').send({
      nombre: 'X', area: 100, poblacion: 200,
    });
    expect(res.status).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════
// POST /regiones/modificar/:idPais
// ════════════════════════════════════════════════════════════════
describe('POST /regiones/modificar/:idPais', () => {
  test('modifica el nombre de una región → 200', async () => {
    const id = await crearPais();
    await crearRegion(id, 'RegionVieja');
    const res = await request(app).post(`/regiones/modificar/${id}`).send({
      nombreRegion: 'RegionVieja', nuevoNombre: 'RegionNueva',
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('sin nombreRegion → 400', async () => {
    const id  = await crearPais();
    const res = await request(app).post(`/regiones/modificar/${id}`).send({ nuevoNombre: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/nombreRegion/);
  });
});

// ════════════════════════════════════════════════════════════════
// DELETE /regiones/:idPais/:nombreRegion
// ════════════════════════════════════════════════════════════════
describe('DELETE /regiones/:idPais/:nombreRegion', () => {
  test('elimina una región existente → 200', async () => {
    const id = await crearPais();
    await crearRegion(id, 'Cundinamarca');
    const res = await request(app).delete(`/regiones/${id}/Cundinamarca`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('región inexistente → 404', async () => {
    const id  = await crearPais();
    const res = await request(app).delete(`/regiones/${id}/NoExiste`);
    expect(res.status).toBe(404);
  });

  test('id inválido → 400', async () => {
    const res = await request(app).delete('/regiones/novalido/Cundinamarca');
    expect(res.status).toBe(400);
  });
});
