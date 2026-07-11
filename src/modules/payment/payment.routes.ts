import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { validate } from "../../middelwares/validate";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { createPaymentSchema } from "./payment.validation";

const router = Router();


router.post("/create", auth(Role.TENANT), validate(createPaymentSchema), PaymentController.createPaymentSession);

// router.post("/confirm", auth(Role.TENANT), validate(confirmPaymentSchema), confirmPayment);

// router.get("/", auth(Role.TENANT), validate(paymentQuerySchema, "query"), getPaymentHistory);

// router.get("/:id", auth(Role.TENANT), validate(paymentIdSchema, "params"), getPaymentById);



export const paymentRoutes = router;