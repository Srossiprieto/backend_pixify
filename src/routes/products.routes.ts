import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controllers';
import { validateSchema } from '../middlewares/validator.middleware';
import { productSchema } from '../schemas/product.schema';
import { authRequired } from '../middlewares/validateToken';

const productRoutes = Router();

productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProductById);
productRoutes.post('/', authRequired, validateSchema(productSchema), createProduct);
productRoutes.put('/:id', authRequired, validateSchema(productSchema), updateProduct);
productRoutes.delete('/:id',authRequired, deleteProduct);

export default productRoutes;