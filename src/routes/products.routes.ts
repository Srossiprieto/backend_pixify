import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controllers';

const productRoutes = Router();

productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProductById);
productRoutes.post('/', createProduct);
productRoutes.put('/:id', updateProduct);
productRoutes.delete('/:id', deleteProduct);

export default productRoutes;