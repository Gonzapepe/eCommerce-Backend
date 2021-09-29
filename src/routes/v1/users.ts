import { Router } from "express";

import { destroy, list, show, edit } from "../../controllers/users";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["STANDARD"])], list);

router.get("/:id", [checkJwt, checkRole(["ADMINISTRATOR"], true)], show);

router.delete("/:id", [checkJwt, checkRole(["ADMINISTRATOR"], true)], destroy);

router.patch("/:id", [checkJwt, checkRole(["ADMINISTRATOR"], true)], edit);

export default router;
