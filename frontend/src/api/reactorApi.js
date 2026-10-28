const USE_MOCK = true; // Cambiar a false cuando el backend real esté conectado
const API_URL = 'http://localhost:3000';

let numeroOculto = Math.floor(Math.random() * 100) + 1;

async function pedirJSON(ruta, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error en la petición');
  }
  return datos;
}

// --- ENDPOINTS EJERCICIO 1: REACTOR ---
export async function enviarAjuste(numero) {
  if (USE_MOCK) {
    if (numero === numeroOculto) return { resultado: 'correcto' };
    return { resultado: numeroOculto > numero ? 'mayor' : 'menor' };
  }
  return pedirJSON('/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero }),
  });
}

export async function reiniciarReactor() {
  if (USE_MOCK) {
    numeroOculto = Math.floor(Math.random() * 100) + 1;
    return { mensaje: 'Reactor reiniciado' };
  }
  return pedirJSON('/reset', { method: 'POST' });
}

// --- ENDPOINTS CASO 2: ASTROLOGISTICS (TIENDA Y CARGA) ---
export async function getInventario() {
  if (USE_MOCK) {
    return [
      { id: 201, nombre: "Tanque de Oxígeno XL", precio: 50.00, stock: 5, categoria: "Soporte Vital" },
      { id: 202, nombre: "Raciones de Comida", precio: 15.50, stock: 10, categoria: "Provisions" },
      { id: 203, nombre: "Batería de Respaldo", precio: 120.00, stock: 0, categoria: "Energía" }
    ];
  }
  return pedirJSON('/api/inventario', { method: 'GET' });
}

export async function getCarga() {
  if (USE_MOCK) {
    return { creditos: 500.00, itemsCargados: [], total: 0.00 };
  }
  return pedirJSON('/api/carga', { method: 'GET' });
}

export async function agregarCargaAPI(equipoId, cantidad = 1) {
  if (USE_MOCK) {
    return { mensaje: "Suministro agregado" };
  }
  return pedirJSON('/api/carga/agregar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipoId, cantidad }),
  });
}

// ESTA ES LA FUNCIÓN QUE BUSCA App.jsx
export async function actualizarUnidadesAPI(id, cantidad) {
  if (USE_MOCK) {
    return { mensaje: "Unidades actualizadas" };
  }
  return pedirJSON(`/api/carga/actualizar-unidades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
  });
}

export async function eliminarCargaAPI(id) {
  if (USE_MOCK) {
    return { mensaje: "Suministro desembarcado" };
  }
  return pedirJSON(`/api/carga/eliminar/${id}`, { method: 'DELETE' });
}