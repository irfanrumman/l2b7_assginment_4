import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middelwares/validate";
import { createPropertiesSchema, propertyIdSchema, rentalQuerySchema, updatePropertySchema } from "./landLord.validation";
import { landLordController } from "./landLord.controller";

const router = Router();



router.post("/properties", auth(Role.LANDLORD), validate(createPropertiesSchema), landLordController.createProperty);


router.put("/properties/:id", auth(Role.LANDLORD),
  validate(propertyIdSchema, "params"),
  validate(updatePropertySchema),
  landLordController.updateProperty
);

router.get("/requests", auth(Role.LANDLORD),
  validate(rentalQuerySchema, "query"), landLordController.getRentalRequestsForLandlord);

router.delete("/properties/:id", auth(Role.LANDLORD),validate(propertyIdSchema, "params"), landLordController.deleteProperty
);


// router.patch("/requests/:id",
//   validate(rentalIdSchema, "params"),
//   validate(updateRentalStatusSchema),
//   updateLandlordRequestStatus
// );  //Approve or reject a rental request




export const landlordRoutes = router;