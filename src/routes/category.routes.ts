import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controllers';

const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);
categoryRoutes.get('/:id', getCategoryById);
categoryRoutes.post('/', createCategory);
categoryRoutes.put('/:id', updateCategory);
categoryRoutes.delete('/:id', deleteCategory);

export default categoryRoutes;