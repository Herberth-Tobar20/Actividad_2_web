import {
  carga,
  buscar_suministro,
  buscar_item,
  creditos_disponibles,
  armar_respuesta_carga,
  redondear,
} from '../data/estado.js';

// GET /api/carga
export function obtener_carga(req, res) {
  res.status(200).json(armar_respuesta_carga());
}

// POST /api/carga/agregar   body: { equipoId, cantidad }
export function agregar_a_carga(req, res) {
  const equipo_id = Number(req.body?.equipoId);
  const cantidad = Number(req.body?.cantidad);

  if (!Number.isInteger(equipo_id) || !Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'equipoId y cantidad deben ser enteros positivos' });
  }

  const suministro = buscar_suministro(equipo_id);
  if (!suministro) {
    return res.status(404).json({ mensaje: 'El suministro no existe en el inventario' });
  }

  if (suministro.stock < cantidad) {
    return res.status(400).json({ mensaje: 'Stock en base insuficiente' });
  }

  const costo = redondear(cantidad * suministro.precio);
  if (costo > creditos_disponibles()) {
    return res.status(400).json({ mensaje: 'Créditos insuficientes para esta cantidad' });
  }

  suministro.stock -= cantidad;

  const item = buscar_item(equipo_id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carga.push({ id: equipo_id, cantidad });
  }

  res.status(200).json({ mensaje: 'Suministro añadido a la nave', ...armar_respuesta_carga() });
}