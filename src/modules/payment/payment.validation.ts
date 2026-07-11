import { z } from "zod";


export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid({
    message: "Invalid Rental Request ID",
  }),

  provider: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(["STRIPE", "SSLCOMMERZ"])),
});




export const verifyPaymentSchema = z.object({
  sessionId: z.string().min(1, {
    message: "Session ID is required",
  }),
});




export type CreatePaymentValidated = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentValidated = z.infer<typeof verifyPaymentSchema>;