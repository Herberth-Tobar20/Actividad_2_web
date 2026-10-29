import { inventario } from '../data/estado.js'; 

// GET /api/inventario
export function obtener_inventario(req, res) {
  res.status(200).json(inventario);
}