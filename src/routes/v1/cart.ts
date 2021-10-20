import { Router } from "express";

import { show, showItems } from "../../controllers/cart";
import { destroy } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";

const router = Router();

router.get("/", [checkJwt], show);

router.get("/:id", [checkJwt], showItems);

router.delete("/:id/:productId", [checkJwt], destroy);

export default router;
