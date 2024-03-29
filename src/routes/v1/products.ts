import { Router } from "express";

import {
  create,
  list,
  destroy,
  edit,
  show,
  showImages,
  addSub,
  removeSub,
  uploadImage,
  deleteImage,
} from "../../controllers/products";
import { add } from "../../controllers/cartItem";
import { checkJwt } from "../../middleware/checkJwt";
import { checkRole } from "../../middleware/checkRole";
import multer from "../../middleware/multer";
import { validatorProduct } from "../../middleware/validation/product/validationProduct";

const router = Router();

router.post(
  "/",
  [checkJwt, checkRole(["ADMINISTRATOR"])],
  multer.array("image", 8),
  create
);

router.get("/", list);

router.get("/:id", show);

router.get("/:id/photos", showImages);

router.post("/:id", [checkJwt], add);

router.post(
  "/:id/photo",
  [checkJwt, checkRole(["ADMINISTRATOR"])],
  multer.array("image", 8),
  uploadImage
);

router.delete("/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], destroy);

router.patch(
  "/:id",
  [checkJwt, checkRole(["ADMINISTRATOR"])],
  multer.array("image", 8),
  edit
);

router.delete(
  "/:id/deleteimage/:imgId",
  [checkJwt, checkRole(["ADMINISTRATOR"])],
  deleteImage
);

router.patch(
  "/:id/removesub/:subId",
  [checkJwt, checkRole(["ADMINISTRATOR"])],
  removeSub
);

router.patch("/sub/:id", [checkJwt, checkRole(["ADMINISTRATOR"])], addSub);

export default router;
