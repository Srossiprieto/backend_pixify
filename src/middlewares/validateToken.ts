import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Interfaz para el payload del JWT
interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const authRequired = (req: Request, res: Response, next: NextFunction): void => {
  const { token } = req.cookies;

  if (!token) {
    console.error("Token not found in cookies");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};