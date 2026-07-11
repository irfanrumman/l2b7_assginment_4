import { z } from "zod";

// export const createPaymentSchema = z.object({
//   body: z.object({
//     rentalRequestId: z.string({
//       required_error: "Rental Request ID is required",
//     }).min(1, "Rental Request ID cannot be empty"),
    
//     provider: z.enum(["STRIPE", "SSLCOMMERZ"], {
//       required_error: "Payment provider is required",
//     }),
//   }),
// });


// export const createPaymentSchema = z.object({
//   body: z.object({
//     rentalRequestId: z.string().uuid({
//       message: "Invalid Rental Request ID",
//     }),

//     provider: z.enum(["STRIPE", "SSLCOMMERZ"]),
//   }),
// });


// export const createPaymentSchema = z.object({
//   rentalRequestId: z.string().uuid({
//     message: "Invalid Rental Request ID",
//   }),

//   provider: z.enum(["STRIPE", "SSLCOMMERZ"]),
// });





export const createPaymentSchema = z.object({
  rentalRequestId: z.string().uuid({
    message: "Invalid Rental Request ID",
  }),

  provider: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(["STRIPE", "SSLCOMMERZ"])),
});



export type CreatePaymentValidated = z.infer<typeof createPaymentSchema>;