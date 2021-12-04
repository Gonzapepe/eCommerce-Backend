import { Router } from "express";

import { create, edit, list, getOne } from "../../controllers/subcategory";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

router.get("/", list);

router.get("/:id", getOne);

router.post("/create", [checkJwt, checkRole(["ADMINISTRATOR"])], create);

router.patch("/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], edit);

export default router;
