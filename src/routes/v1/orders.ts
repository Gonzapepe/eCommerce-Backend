import { Router } from "express";
import { checkRole } from "../../middleware/checkRole";
import { list, check, pending, delivered } from "../../controllers/orders";

const router = Router();

router.get("/", [checkRole(["ADMINISTRATOR"])], list);

router.get("/pending", [checkRole(["ADMINISTRATOR"])], pending);

router.get("/delivered", [checkRole(["ADMINISTRATOR"])], delivered);

router.post("/check/:id", [checkRole(["ADMINISTRATOR"])], check);

export default router;
