import express from 'express';
import cors from 'cors';

import inventarioRoutes from './src/routes/inventario.routes.js';
import cargaRoutes from './src/routes/carga_edicion.routes.js';
import reactorRoutes from './src/routes/reactor.routes.js';  2

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: ['http://localhost:5173'] })); 
app.use(express.json()); 

// Rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/carga', cargaRoutes);
app.use('/', reactorRoutes); 


app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});