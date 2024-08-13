import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product.entity";

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    const { name, description, price, category, size, color } = req.body;
    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.size = size;
    product.color = color;

    const productRepository = AppDataSource.getRepository(Product);
    await productRepository.save(product);

    return res
      .status(200)
      .json({ message: "Product created successfully", product });
  }

  static async getProducts(req: Request, res: Response) {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();

    return res.status(200).json({ data: products });
  }

  static async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, category, size, color } = req.body;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.size = size;
    product.color = color;

    await productRepository.save(product);

    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  }

  static async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    await productRepository.remove(product);

    return res.status(200).json({ message: "Product deleted successfully" });
  }
}
