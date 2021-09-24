import { Router } from "express";

import { register } from "../../controllers/auth";
import { checkJwt } from "../../middleware/checkJwt";
import { validatorRegister } from "../../middleware/validation/auth";

const router = Router();

router.post("/register", [validatorRegister], register);

export default router;
