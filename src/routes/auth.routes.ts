import { Router } from 'express';
import { register, login} from '../controllers/auth.controllers';
import { validateSchema } from '../middlewares/validator.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const authRoutes = Router();

authRoutes.post('/register', validateSchema(registerSchema) ,register);
authRoutes.post('/login',validateSchema(loginSchema) ,login);

export default authRoutes;