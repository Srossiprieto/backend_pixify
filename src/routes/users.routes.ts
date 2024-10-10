import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controllers';

const userRoutes = Router();

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);
userRoutes.post('/', createUser);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:_id', deleteUser);

export default userRoutes;