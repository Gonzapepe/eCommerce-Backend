import { Router } from "express";

import { show } from "../../controllers/cart";
import { checkJwt } from "../../middleware/checkJwt";

const router = Router();

router.get("/", [checkJwt], show);

export default router;
