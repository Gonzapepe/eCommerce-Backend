import { Router } from "express";

import { show } from "../../controllers/cart";
import { deleteItem } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";

const router = Router();

router.get("/", [checkJwt], show);

router.delete("/:id", [checkJwt], deleteItem);

export default router;
