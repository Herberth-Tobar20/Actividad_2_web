// se monta en /api/carga
import { Router } from 'express';
import { 
  obtener_carga, 
  agregar_a_carga, 
  actualizar_unidades, 
  eliminar_de_carga 
} from '../controllers/carga_edicion.controller.js';

const router = Router();

// Tus rutas (Persona 1)
router.get('/', obtener_carga);
router.post('/agregar', agregar_a_carga);

// Rutas de Persona 2
router.put('/actualizar-unidades/:id', actualizar_unidades);
router.delete('/eliminar/:id', eliminar_de_carga);

export default router;