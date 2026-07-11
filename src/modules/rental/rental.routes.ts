import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { createRentalRequestSchema} from "./rental.validation";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();


router.post("/", auth(Role.TENANT), validate(createRentalRequestSchema), rentalController.submitRentalRequest);


// router.get("/", validate(rentalQuerySchema, "query"), getMyRentals);
// router.get("/:id", validate(rentalIdSchema, "params"), getSingleRental);

export const rentalRoutes = router;