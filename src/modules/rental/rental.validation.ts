import { z } from "zod";


export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  moveInDate: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Move-in date must be in the future',
  }),
  message: z.string().max(500, 'Message must be under 500 characters').optional(),
});




export type CreateRentalRequestValidation = z.infer<typeof createRentalRequestSchema>;