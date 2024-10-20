import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).json(["Email already exists"]);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: passwordHash,
    });
    const userSaved = await user.save();

    const token = await createAccessToken({ id: userSaved._id });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'none', // Ajusta según tus necesidades
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7  // Token activo por 7 días
    });
    res.status(201).json({
      message: "User created successfully",
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email }).select("+password");

    if (!userFound) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'none', // Ajusta según tus necesidades
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7  // Token activo por 7 días
    });
    
    res.status(200).json({
      message: "User logged in successfully",
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const userFound = await User.findById(decoded.id);
    if (!userFound) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      message: "User verified successfully",
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (err) {
    console.error("Error verificando el token:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};