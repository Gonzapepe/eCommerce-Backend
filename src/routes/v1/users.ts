import { Router } from "express";

import { destroy, list, show, edit, self } from "../../controllers/users";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { checkSelfOrAdmin } from "../../middleware/checkSelfOrAdmin";
import { validatorEditUser } from "../../middleware/validation/users";

const router = Router();

//No mover la ruta /self para evitar problemas, probar /self/data moviendo el orden

router.get("/", [checkJwt, checkRole(["ADMINISTRATOR"])], list);

router.get("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], show);

router.get("/self/data", [checkJwt], self);

router.delete("/:id", [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"])], destroy);

router.patch(
  "/:id",
  [checkJwt, checkSelfOrAdmin(["ADMINISTRATOR"]), validatorEditUser],
  edit
);

export default router;
