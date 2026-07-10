import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middelwares/validate";
import { createPropertiesSchema } from "./landLord.validation";
import { landLordController } from "./landLord.controller";

const router = Router();


router.post("/properties", auth(Role.LANDLORD), validate(createPropertiesSchema), landLordController.createProperty);




export const landlordRoutes = router;