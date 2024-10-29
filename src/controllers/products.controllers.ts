import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/products";
import Category from "../models/category";
import { productSchema } from "../schemas/product.schema";
import { z } from "zod";

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Validar que el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

interface UserReq {
  user?: { id: string };
}

// Crear un nuevo producto
export const createProduct = async (req: Request & UserReq, res: Response): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    console.error("Token not found in cookies");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Validar los datos de entrada
    const validatedData = productSchema.parse(req.body);
    const { name, description, price, category, image } = validatedData;

    // Verificar si la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Crear el producto
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
    });
    const savedProduct = await newProduct.save();

    // Actualizar la categoría para incluir el producto
    categoryExists.products.push(savedProduct._id as any);
    await categoryExists.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Actualizar un producto existente
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { token } = req.cookies;

  if (!token) {
    console.error("Token not found in cookies");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Validar que el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    // Validar los datos con Zod
    const validatedData = productSchema.parse(req.body);
    
    const product = await Product.findByIdAndUpdate(id, validatedData, { new: true });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Eliminar un producto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { token } = req.cookies;

  if (!token) {
    console.error("Token not found in cookies");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Validar que el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    // Encontrar el producto por ID
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Eliminar el producto
    await product.deleteOne();

    // Encontrar la categoría y eliminar la referencia del producto
    const category = await Category.findById(product.category);
    if (category) {
      category.products = category.products.filter((productId) => productId.toString() !== id);
      await category.save();
    }

    res.json({ message: `Product ${product.name} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
