import { Router } from "express";

import { create, edit, list, getOne } from "../../controllers/subcategory";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

router.get("/", [checkJwt], list);

router.get("/:id", [checkJwt], getOne);

router.post("/create", [checkJwt, checkRole(["ADMINISTRATOR"])], create);

router.put("/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], edit);
