import { Request, Response } from "express";
import User from "../models/users";

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate
    (id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user
    = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }

}

