import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";
import { createCategorySchema } from "./category.validation";
import { validate } from "../../middelwares/validate";

const router = Router();


router.post("/create",
  auth(Role.ADMIN), validate(createCategorySchema), categoryController.createCategoryForProperty);



export const categoryRoutes = router;