// __tests__/setup.js
// Configuración global de Jest — mockea MongoDB para pruebas unitarias
// sin necesidad de conexión real a la BD

const { conectar, obtenerBaseDatos } = require('../modelos/bd');

// Mock del módulo bd.js completo
jest.mock('../modelos/bd', () => {
  const colecciones = {};

  /**
   * Genera un ObjectId-like string para simular inserciones.
   */
  function fakeId() {
    return '6' + Math.random().toString(16).slice(2, 26).padEnd(23, '0');
  }

  /**
   * Fábrica de colección falsa que imita la API de mongodb.Collection.
   */
  function crearColeccionFalsa(nombre) {
    if (!colecciones[nombre]) colecciones[nombre] = [];
    const docs = colecciones[nombre];

    return {
      find: () => ({ toArray: async () => [...docs] }),
      findOne: async (filtro, opciones) => {
        const doc = docs.find(d => {
          if (filtro._id && d._id.toString() !== filtro._id.toString()) return false;
          if (filtro['regiones.nombre']) {
            return d.regiones && d.regiones.some(r => r.nombre === filtro['regiones.nombre']);
          }
          return true;
        });
        if (!doc) return null;
        // Simular projection regiones.$
        if (opciones?.projection?.['regiones.$']) {
          const nombreRegion = filtro['regiones.nombre'];
          const reg = doc.regiones.find(r => r.nombre === nombreRegion);
          return reg ? { ...doc, regiones: [reg] } : null;
        }
        return doc;
      },
      insertOne: async (doc) => {
        const _id = { toString: () => fakeId() };
        docs.push({ ...doc, _id });
        return { insertedId: _id };
      },
      updateOne: async (filtro, update, opts) => {
        const idx = docs.findIndex(d => d._id.toString() === filtro._id?.toString());
        if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };

        if (update.$set)  Object.assign(docs[idx], update.$set);
        if (update.$push) {
          const [campo, val] = Object.entries(update.$push)[0];
          if (!docs[idx][campo]) docs[idx][campo] = [];
          docs[idx][campo].push(val);
        }
        if (update.$pull) {
          const [campo, cond] = Object.entries(update.$pull)[0];
          const [k, v] = Object.entries(cond)[0];
          docs[idx][campo] = (docs[idx][campo] || []).filter(x => x[k] !== v);
        }
        return { matchedCount: 1, modifiedCount: 1 };
      },
      deleteOne: async (filtro) => {
        const idx = docs.findIndex(d => d._id.toString() === filtro._id?.toString());
        if (idx === -1) return { deletedCount: 0 };
        docs.splice(idx, 1);
        return { deletedCount: 1 };
      },
      _reset: () => { docs.length = 0; },
    };
  }

  const dbFalsa = {
    collection: (nombre) => crearColeccionFalsa(nombre),
  };

  return {
    conectar:         jest.fn().mockResolvedValue({}),
    obtenerBaseDatos: jest.fn().mockReturnValue(dbFalsa),
    cerrar:           jest.fn().mockResolvedValue(undefined),
    _reset: () => { Object.keys(colecciones).forEach(k => delete colecciones[k]); },
  };
});
