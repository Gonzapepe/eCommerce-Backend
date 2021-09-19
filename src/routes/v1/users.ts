import { Router } from "express";

import { destroy, list, show } from "../../controllers/users";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

router.get("/", [checkJwt, checkRole(["ADMINISTRATOR"], true)], list);

router.get("/:id", [checkJwt, checkRole(["ADMINISTRATOR"], true)], show);

router.delete("/:id", [checkJwt, checkRole(["ADMINISTRATOR"], true)], destroy);

export default router