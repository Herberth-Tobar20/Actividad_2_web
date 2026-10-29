
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
