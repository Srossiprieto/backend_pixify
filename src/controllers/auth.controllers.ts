import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN || 'localhost', // Adjust as needed
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7  // Token active for 7 days
    });

    res.status(201).json({
      message: "User created successfully",
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN || 'localhost', // Adjust as needed
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7  // Token active for 7 days
    });

    res.status(200).json({
      message: "User logged in successfully",
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