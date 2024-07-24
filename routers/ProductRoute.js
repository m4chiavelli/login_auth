import { Router } from "express";
import {
  getProducts,
  getProductsById,
  createProducts,
  updateProduct,
  deleteProducts,
} from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = Router();

router.get("/products", verifyUser, getProducts);
router.get("/products/:id", verifyUser, getProductsById);
router.post("/products", verifyUser, createProducts);
router.patch("/products/:id", verifyUser, updateProduct);
router.delete("/products/:id", verifyUser, deleteProducts);

export default router;
