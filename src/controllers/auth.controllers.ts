import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {

   const userFound = await User.findOne({ email });
    if (userFound) {
      res.status(400).json({ message: ["Email already exists"] });
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
    res.cookie("token", token);
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

    res.cookie("token", token);
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

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('token', "", {
    expires: new Date(0)
  });
  res.sendStatus(200);
}

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userFound = await User.findById(req.user?.id);

    if (!userFound) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return; // Detenemos la ejecución de la función
    }

    // Enviamos la respuesta con los datos del usuario, sin devolverla
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};