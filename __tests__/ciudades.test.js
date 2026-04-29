// __tests__/ciudades.test.js
// Pruebas automáticas del recurso Ciudad con Jest + Supertest

require('./setup');
const request = require('supertest');
const app     = require('../app');
const bd      = require('../modelos/bd');

// ─── Utilidades ──────────────────────────────────────────────────
async function crearPais() {
  const res = await request(app).post('/paises/agregar').send({
    nombre: 'PaisTest', continente: 'Europa', tipoRegion: 'Provincias',
    codigoAlfa2: 'PT', codigoAlfa3: 'PTS',
  });
  return res.body.datos._id.toString();
}

async function crearRegion(idPais, nombre = 'RegionTest') {
  await request(app).post(`/regiones/agregar/${idPais}`).send({
    nombre, area: 50000, poblacion: 2000000,
  });
  return nombre;
}

async function crearCiudad(idPais, nombreRegion, nombre = 'CiudadTest') {
  await request(app).post(`/ciudades/agregar/${idPais}/${nombreRegion}`).send({
    nombre, capitalRegion: false, capitalPais: false,
  });
  return nombre;
}

beforeEach(() => { bd._reset(); });

// ════════════════════════════════════════════════════════════════
// GET /ciudades/:idPais/:nombreRegion
// ════════════════════════════════════════════════════════════════
describe('GET /ciudades/:idPais/:nombreRegion', () => {
  test('devuelve ciudades de una región existente', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'Madrid');
    await crearCiudad(id, region, 'Alcalá');

    const res = await request(app).get(`/ciudades/${id}/${region}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.datos[0].nombre).toBe('Alcalá');
  });

  test('id inválido → 400', async () => {
    const res = await request(app).get('/ciudades/novalido/RegionX');
    expect(res.status).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════
// POST /ciudades/agregar/:idPais/:nombreRegion
// ════════════════════════════════════════════════════════════════
describe('POST /ciudades/agregar/:idPais/:nombreRegion', () => {
  test('agrega ciudad correctamente → 201', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'Cataluña');
    const res    = await request(app)
      .post(`/ciudades/agregar/${id}/${region}`)
      .send({ nombre: 'Barcelona', capitalRegion: true, capitalPais: false });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.datos.nombre).toBe('Barcelona');
    expect(res.body.datos.capitalRegion).toBe(true);
    expect(res.body.datos.capitalPais).toBe(false);
  });

  test('capitalRegion y capitalPais por defecto son false', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'Murcia');
    const res    = await request(app)
      .post(`/ciudades/agregar/${id}/${region}`)
      .send({ nombre: 'Cartagena' });

    expect(res.body.datos.capitalRegion).toBe(false);
    expect(res.body.datos.capitalPais).toBe(false);
  });

  test('sin nombre → 400', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'X');
    const res    = await request(app)
      .post(`/ciudades/agregar/${id}/${region}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/nombre/);
  });

  test('id inválido → 400', async () => {
    const res = await request(app)
      .post('/ciudades/agregar/novalido/RegionX')
      .send({ nombre: 'Ciudad' });
    expect(res.status).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════
// POST /ciudades/modificar/:idPais/:nombreRegion
// ════════════════════════════════════════════════════════════════
describe('POST /ciudades/modificar/:idPais/:nombreRegion', () => {
  test('sin nombreCiudad → 400', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id);
    const res    = await request(app)
      .post(`/ciudades/modificar/${id}/${region}`)
      .send({ nuevoNombre: 'OtraCiudad' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/nombreCiudad/);
  });

  test('id inválido → 400', async () => {
    const res = await request(app)
      .post('/ciudades/modificar/novalido/RegionX')
      .send({ nombreCiudad: 'CiudadX' });
    expect(res.status).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════
// DELETE /ciudades/:idPais/:nombreRegion/:nombreCiudad
// ════════════════════════════════════════════════════════════════
describe('DELETE /ciudades/:idPais/:nombreRegion/:nombreCiudad', () => {
  test('elimina una ciudad existente → 200', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'Sevilla');
    await crearCiudad(id, region, 'Écija');

    const res = await request(app).delete(`/ciudades/${id}/${region}/Écija`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('ciudad inexistente → 404', async () => {
    const id     = await crearPais();
    const region = await crearRegion(id, 'X');
    const res    = await request(app).delete(`/ciudades/${id}/${region}/NoExiste`);
    expect(res.status).toBe(404);
  });

  test('id inválido → 400', async () => {
    const res = await request(app).delete('/ciudades/novalido/RegionX/CiudadX');
    expect(res.status).toBe(400);
  });
});
