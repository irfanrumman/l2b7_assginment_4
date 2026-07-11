import z from "zod";

export const getAllUsersSchema = z.object({
  role: z.enum(['TENANT', 'LANDLORD', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'BANNED']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});


export const adminPropertyGetSchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  isAvailable: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});



export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});



export const updateUserStatusSchema = z.object({
  status: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['ACTIVE', 'BANNED'], {
      message: 'Status must be ACTIVE or BANNED',
    })
  ),
});



export const adminRentalQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});




export type GetAllUsersValidation = z.infer<typeof getAllUsersSchema>;
export type UserIdValidated = z.infer<typeof userIdSchema>;
export type UpdateUserStatusValidated = z.infer<typeof updateUserStatusSchema>;
export type AdminPropertyGetValidated = z.infer<typeof adminPropertyGetSchema>;
export type AdminRentalQueryValidated = z.infer<typeof adminRentalQuerySchema>;