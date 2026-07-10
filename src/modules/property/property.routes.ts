import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { propertyGetSchema } from "./property.validation";
import { propertyController } from "./property.controller";


const router = Router();



router.get("/",validate(propertyGetSchema, "query"),propertyController.getAllProperties);

// router.get("/:id", validate(propertyIdSchema, "params"), getSingleProperty);


// router.get("/categories);


  export const propertyRoutes = router;