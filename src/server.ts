import app from './app';

import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

// Conectar a la base de datos
connectDB();

// Levantar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});