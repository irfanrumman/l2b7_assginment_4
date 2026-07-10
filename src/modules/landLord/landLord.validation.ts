import { z } from "zod";

export const createPropertiesSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(10),
  location: z.string().trim().min(2),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().uuid(),
});







export type CreatePropertiesvalidated = z.infer<typeof createPropertiesSchema>;
