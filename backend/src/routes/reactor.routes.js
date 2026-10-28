// [persona 2] se monta en la raíz: POST /adjust y POST /reboot
import express from 'express';
import { ajustar, reiniciar } from '../controllers/reactor.controller.js';

const router = express.Router();

router.post('/adjust', ajustar);
router.post('/reboot', reiniciar);

export default router;
