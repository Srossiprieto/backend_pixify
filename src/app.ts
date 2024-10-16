import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/products.routes';
import categoryRoutes from './routes/category.routes';
import authRoutes from './routes/auth.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

// Configuración de CORS para habilitar credenciales
const corsOptions = {
  credentials: true, // Habilitar el uso de credenciales
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

export default app;