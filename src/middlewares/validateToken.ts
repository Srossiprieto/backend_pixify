import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

// Interfaz para el payload del JWT
interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const authRequired = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("Token not found in cookies or headers");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET as string) as CustomJwtPayload;
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

