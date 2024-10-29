import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

interface CustomRequest extends Request {
  user?: { id: string };
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Obtener el token de las cookies o del encabezado
  console.log('token', token);
  
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; // Añadir return para detener la ejecución del middleware
  }

  jwt.verify(token, JWT_SECRET as string, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized' });
      return; // Añadir return para detener la ejecución del middleware
    }

    if (user && typeof user === "object" && "id" in user) {
      req.user = user as { id: string };
    } else {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    next();
  });
};