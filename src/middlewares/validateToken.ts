import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return; // Detenemos la ejecución de la función, pero no devolvemos el Response
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

    // Verificamos si el payload tiene un "id"
    if (decoded?.id) {
      req.user = { id: decoded.id };
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
