import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controllers';
import { validateSchema } from '../middlewares/validator.middleware';
import { categorySchema } from '../schemas/category.schema';
import { authRequired } from '../middlewares/validateToken';

const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);
categoryRoutes.get('/:id', getCategoryById);

// Rutas protegidas que requieren autenticación
categoryRoutes.post('/', authRequired, validateSchema(categorySchema), createCategory);
categoryRoutes.put('/:id', authRequired, validateSchema(categorySchema), updateCategory);
categoryRoutes.delete('/:id', authRequired, deleteCategory);

export default categoryRoutes;
