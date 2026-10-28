// [persona 2] se monta en /api/carga
import express from 'express';
import { actualizar_unidades, eliminar_de_carga } from '../controllers/carga_edicion.controller.js';

const router = express.Router();

router.put('/actualizar-unidades/:id', actualizar_unidades);
router.delete('/eliminar/:id', eliminar_de_carga);

export default router;
