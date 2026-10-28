const USE_MOCK = true; // cambiar a false cuando el backend exista
const API_URL = 'http://localhost:3000'; // el puerto lo define quien haga el backend

let numeroOculto = Math.floor(Math.random() * 100) + 1;

async function pedirJSON(ruta, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje);
  }
  return datos;
}

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