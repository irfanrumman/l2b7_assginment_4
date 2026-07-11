import { z } from "zod";

export const createPropertiesSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10),
  location: z.string().trim().min(2),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid(),
});


export const propertyIdSchema = z.object({
  id: z.string().uuid('Invalid property ID'),
});

export const updatePropertySchema = z.object({
  title: z.string().trim().min(3).max(255).optional(),
  description: z.string().trim().min(10).optional(),
  location: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
});



export const rentalQuerySchema = z.object({
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"])
    .optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});







export type CreatePropertiesvalidated = z.infer<typeof createPropertiesSchema>;
export type PropertyIdValidated = z.infer<typeof propertyIdSchema>;
export type UpdatePropertyValidated = z.infer<typeof updatePropertySchema>;
export type RentalQueryValidated = z.infer<typeof rentalQuerySchema>;
