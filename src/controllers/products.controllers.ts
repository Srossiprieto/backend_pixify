import { Request, Response } from "express";
import Product from "../models/products";

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar un producto existente
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar un producto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};