// temporizador de sesión y reinicio
import { inventario, carga } from '../data/estado.js';

export const duracion_sesion = 600; // segundos para completar la carga

// copia del inventario tal como arranca el servidor, para poder restaurarlo
const inventario_inicial = inventario.map((s) => ({ ...s }));

let inicio_sesion = Date.now();

const segundos_restantes = () => {
  const transcurridos = Math.floor((Date.now() - inicio_sesion) / 1000);
  return Math.max(duracion_sesion - transcurridos, 0);
};

export const sesion_expirada = () => segundos_restantes() === 0;

// GET /api/sesion
export function obtener_sesion(req, res) {
  const segundos = segundos_restantes();
  res.json({ segundos, expirada: segundos === 0 });
}

// POST /api/sesion/reiniciar: devuelve el stock, vacía la carga y reinicia el tiempo
export function reiniciar_sesion(req, res) {
  inventario.length = 0;
  inventario.push(...inventario_inicial.map((s) => ({ ...s })));
  carga.length = 0;
  inicio_sesion = Date.now();
  res.json({ mensaje: 'Sesión reiniciada', segundos: duracion_sesion, expirada: false });
}

// middleware: con la sesión vencida solo se permite consultar (get)
export function exigir_sesion_activa(req, res, next) {
  if (req.method !== 'GET' && sesion_expirada()) {
    return res.status(403).json({ mensaje: 'La sesión expiró. Reinicia la sesión para continuar' });
  }
  next();
}