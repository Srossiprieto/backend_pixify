import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users.routes'; 
import productRoutes from './routes/products.routes';
import categoryRoutes from './routes/category.routes';
dotenv.config();

const app = express();

app.use(express.json()); 

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes); 

export default app;
