import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middelwares/validate";
import { createPropertiesSchema } from "./landLord.validation";
import { landLordController } from "./landLord.controller";

const router = Router();



router.post("/properties", auth(Role.LANDLORD), validate(createPropertiesSchema), landLordController.createProperty);






// router.put(
//   "/properties/:id",
//   validate(propertyIdSchema, "params"),
//   validate(updatePropertySchema),
//   updateLandlordProperty
// );

// router.delete(
//   "/properties/:id",
//   validate(propertyIdSchema, "params"),
//   deleteLandlordProperty
// );

// router.get(
//   "/requests",
//   validate(rentalQuerySchema, "query"),
//   getLandlordRequests
// );

// router.patch(
//   "/requests/:id",
//   validate(rentalIdSchema, "params"),
//   validate(updateRentalStatusSchema),
//   updateLandlordRequestStatus
// );



export const landlordRoutes = router;