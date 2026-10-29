// se monta en /api/inventario
import express from 'express';
import { obtener_inventario } from '../controllers/inventario.controller.js';

const router = express.Router();

router.get('/', obtener_inventario);

export default router;