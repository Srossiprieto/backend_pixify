import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controllers';
import { validateSchema } from '../middlewares/validator.middleware';
import { productSchema } from '../schemas/product.schema';
import { verifyToken } from '../middlewares/verifytoken';
const productRoutes = Router();

productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProductById);
productRoutes.post('/', verifyToken, validateSchema(productSchema), createProduct);
productRoutes.put('/:id', verifyToken, validateSchema(productSchema), updateProduct);
productRoutes.delete('/:id',verifyToken, deleteProduct);

export default productRoutes;