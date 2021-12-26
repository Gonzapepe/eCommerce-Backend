import { Router } from "express";

import { show, pay } from "../../controllers/cart";
import { deleteItem } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";

const router = Router();

router.get("/", [checkJwt], show);

router.delete("/:id", [checkJwt], deleteItem);

router.get("/pay", [checkJwt], pay);

export default router;
