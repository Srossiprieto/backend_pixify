import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Interfaz para el payload del JWT
interface CustomJwtPayload extends JwtPayload {
  id: string;
}


export const authRequired = (req: Request, res: Response, next: NextFunction): void => {
  // Accede correctamente a la cookie "token"
  const {token} = req.cookies;
  console.log(token);
  // Si no hay token, retorna un 401
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    console.log("No hay token");
    return;
  }

  try {
    // Verifica el token usando el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    
    // Almacena el payload decodificado en req.user
    req.user = decoded;

    // Continua con el siguiente middleware
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
