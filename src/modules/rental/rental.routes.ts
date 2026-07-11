import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { createRentalRequestSchema, rentalIdSchema, rentalRequestAllGetSchema} from "./rental.validation";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();


router.post("/", auth(Role.TENANT), validate(createRentalRequestSchema), rentalController.submitRentalRequest);


router.get("/", auth(Role.TENANT), validate(rentalRequestAllGetSchema, "query"), rentalController.getAllRentalRequests);

router.get("/:id", auth(Role.TENANT), validate(rentalIdSchema, "params"), rentalController.getRentalRequestById);

export const rentalRoutes = router;