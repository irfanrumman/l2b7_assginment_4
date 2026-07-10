import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";
import { categoryIdSchema, createCategorySchema, getAllCategoriesSchema, updateCategorySchema } from "./category.validation";
import { validate } from "../../middelwares/validate";

const router = Router();


router.post("/create",
  auth(Role.ADMIN), validate(createCategorySchema), categoryController.createCategoryForProperty);

  router.get("/", validate(getAllCategoriesSchema, "query"), categoryController.getAllCategories
);

  router.get("/:id",
  validate(categoryIdSchema, "params"), categoryController.getSingleCategory);

router.patch("/:id", auth(Role.ADMIN), validate(categoryIdSchema, "params"), validate(updateCategorySchema), categoryController.updateCategory);


router.delete("/delete/:id", auth(Role.ADMIN), validate(categoryIdSchema, "params"), categoryController.categoryDelete);



export const categoryRoutes = router;