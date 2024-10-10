import { Request, Response } from "express";
import Category from "../models/category";

// Obtener todas las categorías
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().populate('products');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener categoría por ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate('products');
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};