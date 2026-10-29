// se monta en /api/sesion
import express from 'express';
import { obtener_sesion, reiniciar_sesion } from '../controllers/sesion.controller.js';

const router = express.Router();

router.get('/', obtener_sesion);
router.post('/reiniciar', reiniciar_sesion);

export default router;