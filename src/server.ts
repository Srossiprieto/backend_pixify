import app from './app';
import { config } from './config/env';
import connectDB from './config/db';

// Conectar a la base de datos
connectDB();

// Levantar el servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});
