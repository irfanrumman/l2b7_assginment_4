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


export const paymentQuerySchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const paymentIdSchema = z.object({
  id: z.string().uuid('Invalid payment ID'),
});


export type CreatePaymentValidated = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentValidated = z.infer<typeof verifyPaymentSchema>;
export type PaymentQueryValidated = z.infer<typeof paymentQuerySchema>;
export type PaymentIdValidated = z.infer<typeof paymentIdSchema>;