import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { CreatePropertiesvalidated } from "./landLord.validation";

const createPropertyIntoDB = async (
  landlordId: string,
  payload: CreatePropertiesvalidated,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found", httpStatus.NOT_FOUND);
  }

  const createdProperty = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      price: payload.price,
      landlord: {
        connect: {
          id: landlordId,
        },
      },
      category: {
        connect: {
          id: payload.categoryId,
        },
      },

      ...(payload.isAvailable !== undefined
        ? { isAvailable: payload.isAvailable }
        : {}),
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
            name: true,
            description: true,
        },
      },
    },
  });

  return createdProperty;
};

export const landLordService = {
  createPropertyIntoDB,
};
