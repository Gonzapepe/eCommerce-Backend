import { Router } from "express";

import { show } from "../../controllers/cart";
import { checkJwt } from "../../middleware/checkJwt";
import { checkSelfOrAdmin } from "../../middleware/checkSelfOrAdmin";

const router = Router();

router.get("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], show);

export default router;
