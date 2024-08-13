
import * as express from "express";
import { ProductController } from "../controllers/product.controller";
import { authentification } from "../middleware/auth.middleware";
import { authorization } from "../middleware/authentification";

const Router = express.Router();

Router.post(
  "/products",
  authentification,
  authorization(["admin"]),
  ProductController.createProduct
);

Router.get(
  "/products",
  authentification,
  authorization(["admin", "user"]),
  ProductController.getProducts
);

Router.put(
  "/products/:id",
  authentification,
  authorization(["admin"]),
  ProductController.updateProduct
);

Router.delete(
  "/products/:id",
  authentification,
  authorization(["admin"]),
  ProductController.deleteProduct
);

export { Router as productRouter };