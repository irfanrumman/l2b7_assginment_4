import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { GetAllUsersValidation } from './admin.validation';




const getAllUsersFromDB = async (filters: GetAllUsersValidation) => {
  const { role, status, search, page, limit } = filters;

  const pageNumber = page && page > 0 ? page : 1;
  const pageSize = limit && limit > 0 ? limit : 10;

  const whereConditions: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        // password ইচ্ছাকৃতভাবে বাদ — কখনো এখানে আসবে না
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    data: users,
  };
};

export const adminService = {
  getAllUsersFromDB,
};