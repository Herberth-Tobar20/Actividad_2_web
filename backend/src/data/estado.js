// backend/src/data/estado.js
export const PRESUPUESTO_INICIAL = 500;

// Inventario de la base: se muta en el lugar (no se reasigna)
export const inventario = [
  { id: 201, nombre: 'Tanque de Oxígeno XL', precio: 50.0, stock: 5, categoria: 'Soporte Vital' },
  { id: 202, nombre: 'Ración Liofilizada (pack)', precio: 20.0, stock: 10, categoria: 'Alimentación' },
  { id: 203, nombre: 'Panel Solar Plegable', precio: 120.0, stock: 3, categoria: 'Energía' },
  { id: 204, nombre: 'Kit Médico Orbital', precio: 75.5, stock: 4, categoria: 'Salud' },
  { id: 205, nombre: 'Traje EVA', precio: 200.0, stock: 5, categoria: 'Equipamiento' },
  { id: 206, nombre: 'Filtro de Agua', precio: 35.0, stock: 0, categoria: 'Soporte Vital' },
];

// Carga de la nave: arreglo de { id, cantidad }
export const carga = [];

// Evita errores de decimales de JS (por ejemplo 75.5 * 3)
export function redondear(n) {
  return Math.round(n * 100) / 100;
}

export function buscar_suministro(id) {
  return inventario.find((s) => s.id === id);
}

export function buscar_item(id) {
  return carga.find((i) => i.id === id);
}

// Costo total de lo que hay en la carga
function total_carga() {
  return redondear(
    carga.reduce((acc, i) => acc + i.cantidad * buscar_suministro(i.id).precio, 0)
  );
}

// Presupuesto menos el costo de la carga
export function creditos_disponibles() {
  return redondear(PRESUPUESTO_INICIAL - total_carga());
}

// Forma que pide el enunciado: { creditos, itemsCargados, total }
export function armar_respuesta_carga() {
  return {
    creditos: creditos_disponibles(),
    itemsCargados: carga.map(({ id, cantidad }) => ({ id, cantidad })),
    total: total_carga(),
  };
}