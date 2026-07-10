import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PropertyGetValidated } from "./property.validation";






const getAllPropertiesFromDB = async (filters: PropertyGetValidated) => {

 
  const {
    location,
    minPrice,
    maxPrice,
    categoryId,
    search,
    isAvailable,
    page,
    limit,
  } = filters;

  const pageNumber = page && Number(page) > 0 ? Number(page) : 1;
  const pageSize = limit && Number(limit) > 0 ? Number(limit) : 10;


const whereConditions: Prisma.PropertyWhereInput = {
  ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
  ...(categoryId ? { categoryId } : {}),
  ...(isAvailable !== undefined
    ? { isAvailable: isAvailable ? true : false }
    : {}),
  ...(minPrice !== undefined || maxPrice !== undefined
    ? {
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      }
    : {}),
  ...(search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }
    : {}),
};

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      include: {
        landlord: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        category: {
          select: { id: true, name: true, description: true },
        },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    data: properties,
  };
};





// const getPropertyByIdFromDB = async (id: string) => {
//   const property = await prisma.property.findUnique({
//     where: { id },
//     include: {
//       landlord: {
//         select: { id: true, name: true, email: true, phone: true, role: true },
//       },
//       category: {
//         select: { id: true, name: true, description: true },
//       },
//       reviews: {
//         include: {
//           tenant: { select: { id: true, name: true } },
//         },
//       },
//     },
//   });

//   if (!property) {
//     throw new AppError('Property not found', httpStatus.NOT_FOUND);
//   }

//   return property;
// };


export const propertyService = {
  getAllPropertiesFromDB,
};