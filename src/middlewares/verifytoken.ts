import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

interface CustomRequest extends Request {
  user?: { id: string };
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token; // Obtener el token de las cookies
  console.log('Token en backend:', token);

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; // Añadir return para detener la ejecución del middleware
  }

  jwt.verify(token, JWT_SECRET as string, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized' });
      return; // Añadir return para detener la ejecución del middleware
    }

    console.log("Decoded User:", user); // Depuración: Verificar el usuario decodificado

    if (user && typeof user === "object" && "id" in user) {
      req.user = user as { id: string };
    } else {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    next();
  });
};