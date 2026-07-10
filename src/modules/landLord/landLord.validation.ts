import { z } from "zod";

export const createPropertiesSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  image: z.string().url().optional(),
  amenities: z.array(z.string()).default([]),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().min(1),
});



export type CreatePropertiesByLandlord = z.infer<typeof createPropertiesSchema>;