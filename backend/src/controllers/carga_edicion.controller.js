// GET /api/carga
export function obtener_carga(req, res) {
  res.status(200).json(armar_respuesta_carga());
}

// POST /api/carga/agregar   body: { equipoId, cantidad }
export function agregar_a_carga(req, res) {
  const equipo_id = Number(req.body?.equipoId);
  const cantidad = Number(req.body?.cantidad);

  // validación de entrada
  if (!Number.isInteger(equipo_id) || !Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'equipoId y cantidad deben ser enteros positivos' });
  }

  // el suministro existe en la base
  const suministro = buscar_suministro(equipo_id);
  if (!suministro) {
    return res.status(404).json({ mensaje: 'El suministro no existe en el inventario' });
  }

  // validación de stock 
  if (suministro.stock < cantidad) {
    return res.status(400).json({ mensaje: 'Stock en base insuficiente' });
  }

  //validación de créditos
  const costo = redondear(cantidad * suministro.precio);
  if (costo > creditos_disponibles()) {
    return res.status(400).json({ mensaje: 'Créditos insuficientes para esta cantidad' });
  }

  //recién ahora se modifica el estado: bloquea stock y acumula en la carga
  suministro.stock -= cantidad;

  const item = buscar_item(equipo_id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carga.push({ id: equipo_id, cantidad });
  }

  res.status(200).json({ mensaje: 'Suministro añadido a la nave', ...armar_respuesta_carga() });
}

// [persona 2] PUT /api/carga/actualizar-unidades/:id y DELETE /api/carga/eliminar/:id
import {
  carga,
  buscar_suministro,
  buscar_item,
  creditos_disponibles,
  armar_respuesta_carga,
  redondear,
} from '../data/estado.js';

export function actualizar_unidades(req, res) {
  const id = Number(req.params.id);
  const nueva_cantidad = req.body?.cantidad;

  // la cantidad nueva debe ser un entero; 0 equivale a desembarcar el suministro
  if (!Number.isInteger(nueva_cantidad) || nueva_cantidad < 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un número entero mayor o igual a 0' });
  }

  const item = buscar_item(id);
  const suministro = buscar_suministro(id);
  if (!item || !suministro) {
    return res.status(404).json({ mensaje: 'El suministro no está en la carga' });
  }

  // diferencia > 0 sube unidades (consume stock y créditos); < 0 las baja (devuelve stock)
  const diferencia = nueva_cantidad - item.cantidad;

  if (diferencia > suministro.stock) {
    return res.status(400).json({ mensaje: 'Stock en base insuficiente' });
  }

  const costo_extra = redondear(diferencia * suministro.precio);
  if (costo_extra > creditos_disponibles()) {
    return res.status(400).json({ mensaje: 'Créditos insuficientes para esta cantidad' });
  }

  suministro.stock -= diferencia;

  if (nueva_cantidad === 0) {
    carga.splice(carga.indexOf(item), 1);
  } else {
    item.cantidad = nueva_cantidad;
  }

  res.json({ mensaje: 'Unidades actualizadas', ...armar_respuesta_carga() });
}

export function eliminar_de_carga(req, res) {
  const id = Number(req.params.id);

  const indice = carga.findIndex((i) => i.id === id);
  if (indice === -1) {
    return res.status(404).json({ mensaje: 'El suministro no está en la carga' });
  }

  // se quita de la carga y las unidades vuelven al stock de la base
  const [removido] = carga.splice(indice, 1);
  buscar_suministro(id).stock += removido.cantidad;

  res.json({ mensaje: 'Suministro desembarcado', ...armar_respuesta_carga() });
}
