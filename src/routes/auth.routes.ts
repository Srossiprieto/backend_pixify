import { Router } from 'express';
import { register, login,verifyToken} from '../controllers/auth.controllers';
import { authRequired } from '../middlewares/validateToken';
import { validateSchema } from '../middlewares/validator.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const authRoutes = Router();

authRoutes.post('/register',validateSchema(registerSchema) ,register);
authRoutes.post('/login',validateSchema(loginSchema) ,login);
authRoutes.get('/verify', verifyToken);

export default authRoutes;