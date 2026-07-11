import { Router } from "express";
import { auth } from "../../middelwares/auth";
import { validate } from "../../middelwares/validate";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { createPaymentSchema, paymentIdSchema, paymentQuerySchema, verifyPaymentSchema } from "./payment.validation";

const router = Router();


router.post("/create", auth(Role.TENANT), validate(createPaymentSchema), PaymentController.createPaymentSession);

router.post("/confirm", auth(Role.TENANT), validate(verifyPaymentSchema), PaymentController.verifyPayment);


router.get("/", auth(Role.TENANT), validate(paymentQuerySchema, "query"), PaymentController.getMyPaymentHistory);

router.get("/:id", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), validate(paymentIdSchema, "params"), PaymentController.getPaymentById);



export const paymentRoutes = router;