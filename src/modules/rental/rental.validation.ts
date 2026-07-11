import { z } from "zod";


export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  moveInDate: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Move-in date must be in the future',
  }),
  message: z.string().max(500, 'Message must be under 500 characters').optional(),
});


export const rentalRequestAllGetSchema = z.object({
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"])
    .optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const rentalIdSchema = z.object({
  id: z.string().uuid('Invalid rental ID'),
});


export type CreateRentalRequestValidation = z.infer<typeof createRentalRequestSchema>;

export type RentalRequestAllGetValidation = z.infer<typeof rentalRequestAllGetSchema>;

export type RentalIdValidation = z.infer<typeof rentalIdSchema>;