import { Router } from "express";

import { show } from "../../controllers/cart";
import { destroy } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";

const router = Router();

router.get("/", [checkJwt], show);

router.delete("/:id/:productId", [checkJwt], destroy);

export default router;
