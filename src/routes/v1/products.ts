import { Router } from "express";

import {
  create,
  list,
  destroy,
  edit,
  show,
  addSub,
} from "../../controllers/products";
import { add } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import { validatorProduct } from "../../middleware/validation/product/validationProduct";

const router = Router();

router.post(
  "/",
  [validatorProduct, checkJwt, checkRole(["ADMINISTRATOR"])],
  create
);

router.get("/", list);

router.get("/:id", show);

router.post("/:id", [checkJwt], add);

router.delete("/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], destroy);

router.patch("/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], edit);

router.patch("/sub/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], addSub);

export default router;
