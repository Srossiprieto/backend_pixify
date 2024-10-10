import { Request, Response } from "express";
import Product from "../models/products";
import Category from "../models/category";



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
    const { name, description, price, category, image } = req.body;

    // Verificar si la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Crear el producto
    const product = new Product({ name, description, price, category, image });
    await product.save();

    // Actualizar la categoría para incluir el producto
    categoryExists.products.push(product._id as any);
    await categoryExists.save();

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
      category.products = category.products.filter(productId => productId.toString() !== id);
      await category.save();
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};