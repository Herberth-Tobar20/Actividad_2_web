import { Router } from 'express';
import { 
  actualizar_unidades, 
  eliminar_de_carga 
} from '../controllers/carga_edicion.controller.js';

const router = Router();

// Solo se mantienen las rutas de Persona 2
router.put('/actualizar-unidades/:id', actualizar_unidades);
router.delete('/eliminar/:id', eliminar_de_carga);

export default router;