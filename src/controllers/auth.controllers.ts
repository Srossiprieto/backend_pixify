import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).json({ message: "Email already exists" });
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

    res.status(201).json({
      message: "User created successfully",
      token,  // Enviar el token en la respuesta
      user: {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
 try {
    const userFound = await User.findOne({ email }).select("+password");

    if (!userFound) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = await createAccessToken({ id: userFound._id });

    res.status(200).json({
      message: "User logged in successfully",
      token,  // Enviar el token en la respuesta
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    console.error("Token not found in cookies");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
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
    console.error("Error verifying token:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};