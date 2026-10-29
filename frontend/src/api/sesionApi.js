import { pedirJSON } from './apiClient';

// GET /api/sesion -> { segundos, expirada }
export async function getSesion() {
  return pedirJSON('/api/sesion', { method: 'GET' });
}

// POST /api/sesion/reiniciar -> { mensaje, segundos, expirada }
export async function reiniciarSesion() {
  return pedirJSON('/api/sesion/reiniciar', { method: 'POST' });
}