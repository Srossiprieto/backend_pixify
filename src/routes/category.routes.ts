import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controllers';
import { validateSchema } from '../middlewares/validator.middleware';
import { categorySchema } from '../schemas/category.schema';
import { verifyToken } from '../middlewares/verifytoken'; // Importa el middleware de autenticación

const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);
categoryRoutes.get('/:id', getCategoryById);

// Rutas protegidas que requieren autenticación
categoryRoutes.post('/', verifyToken, validateSchema(categorySchema), createCategory);
categoryRoutes.put('/:id', verifyToken, validateSchema(categorySchema), updateCategory);
categoryRoutes.delete('/:id', verifyToken, deleteCategory);

export default categoryRoutes;
