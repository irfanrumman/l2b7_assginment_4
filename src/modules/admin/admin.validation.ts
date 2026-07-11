import z from "zod";

export const getAllUsersSchema = z.object({
  role: z.enum(['TENANT', 'LANDLORD', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'BANNED']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type GetAllUsersValidation = z.infer<typeof getAllUsersSchema>;