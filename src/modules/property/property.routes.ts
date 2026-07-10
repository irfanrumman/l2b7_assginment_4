import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { propertyGetSchema } from "./property.validation";
import { propertyController } from "./property.controller";


const router = Router();



router.get("/",validate(propertyGetSchema, "query"),propertyController.getAllProperties);



  export const propertyRoutes = router;