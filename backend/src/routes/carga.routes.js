// se monta en /api/carga
import { Router } from 'express';
import { obtener_carga, agregar_a_carga } from '../controllers/carga.controller.js';

const router = Router();

router.get('/', obtener_carga);
router.post('/agregar', agregar_a_carga);

export default router;