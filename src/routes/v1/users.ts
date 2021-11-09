import { Router } from "express";

import { destroy, list, show, edit, self } from "../../controllers/users";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkSelfOrAdmin } from "../../middleware/checkSelfOrAdmin";

const router = Router();

router.get("/self", [checkJwt], self);

router.get("/", [checkJwt, checkRole(["ADMINISTRATOR"])], list);

router.get("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], show);

router.delete("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], destroy);

router.patch("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], edit);

export default router;
