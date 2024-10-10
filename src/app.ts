import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/users.routes';
import productRoutes from './routes/products.routes';
import categoryRoutes from './routes/category.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

export default app;