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
  id: z.string().min(1),
});

export const updatePropertySchema = z.object({
  title: z.string().trim().min(3).max(255).optional(),
  description: z.string().trim().min(10).optional(),
  location: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
});





export type CreatePropertiesvalidated = z.infer<typeof createPropertiesSchema>;
export type PropertyIdValidated = z.infer<typeof propertyIdSchema>;
export type UpdatePropertyValidated = z.infer<typeof updatePropertySchema>;
