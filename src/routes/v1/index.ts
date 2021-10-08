import { Router } from "express";

import users from "./users";
import auth from "./auth";
import products from "./products";

const router = Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/products", products);

export default router;
