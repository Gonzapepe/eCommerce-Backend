import { Router } from "express";
import { checkRole } from "../../middleware/checkRole";
import { list, check } from "../../controllers/orders";

const router = Router();

router.get("/", [checkRole(["ADMINISTRATOR"])], list);

router.post("/check/:id", [checkRole(["ADMINISTRATOR"])], check);

export default router;
