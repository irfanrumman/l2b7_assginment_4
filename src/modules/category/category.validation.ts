import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const getAllCategoriesSchema = z.object({}).strict();

export const categoryIdSchema = z.object({
  id: z.string().min(1),
});


export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});


export type CreateCategoryForProperty = z.infer<typeof createCategorySchema>;
export type CategoryIdValidated = z.infer<typeof categoryIdSchema>;
export type UpdateCategoryValidated = z.infer<typeof updateCategorySchema>;