import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middelwares/validate";
import { createReviewSchema } from "./review.validation";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.TENANT), validate(createReviewSchema), reviewController.createReview);


export const reviewRoutes = router;