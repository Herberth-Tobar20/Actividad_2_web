import express from 'express';
import cors from 'cors';

import inventarioRoutes from './src/routes/inventario.routes.js';
import cargaRoutes from './src/routes/carga.routes.js'; 
import cargaEdicionRoutes from './src/routes/carga_edicion.routes.js'; 
import reactorRoutes from './src/routes/reactor.routes.js';
import sesion_routes from './src/routes/sesion.routes.js';
import { exigir_sesion_activa } from './src/controllers/sesion.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

// Rutas
app.use('/api/inventario', inventarioRoutes);
//app.use('/api/carga', exigir_sesion_activa);
app.use('/api/carga', cargaRoutes); 
app.use('/api/carga', cargaEdicionRoutes);
app.use('/api/sesion', sesion_routes);
app.use('/', reactorRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});