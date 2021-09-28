import { Router } from "express";

import { register, login, changePassword } from "../../controllers/auth";
import { checkJwt } from "../../middleware/checkJwt";
import {
  validatorRegister,
  validatorLogin,
} from "../../middleware/validation/auth";

const router = Router();

router.post("/register", [validatorRegister], register);
router.post("/login", [validatorLogin], login);
router.post("/changePassword", changePassword);

export default router;
