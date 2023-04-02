import { Router } from "express";

import users from "./users";
import auth from "./auth";
import products from "./products";
import cart from "./cart";
import subcategory from "./subcategory";
import orders from "./orders";

const router = Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/products", products);
router.use("/cart", cart);
router.use("/subcategory", subcategory);
router.use("/orders", orders);

export default router;
