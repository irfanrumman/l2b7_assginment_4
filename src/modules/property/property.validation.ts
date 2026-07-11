import { z } from "zod";



export const propertyGetSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  isAvailable: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  page: z.string().optional(),
  limit: z.string().optional(),
});


export const propertyIdSchema = z.object({
  id: z.string().uuid('Invalid property ID'),
});


export type PropertyGetValidated = z.infer<typeof propertyGetSchema>;