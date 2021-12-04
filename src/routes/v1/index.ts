import { Router } from "express";

import users from "./users";
import auth from "./auth";
import products from "./products";
import cart from "./cart";
import subcategory from "./subcategory";

const router = Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/products", products);
router.use("/cart", cart);
router.use("/subcategory", subcategory);

export default router;
