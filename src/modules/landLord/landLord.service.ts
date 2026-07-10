import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { CreatePropertiesvalidated, UpdatePropertyValidated } from "./landLord.validation";




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


const updatePropertyInDB = async (
  propertyId: string, landlordId: string,
  payload: UpdatePropertyValidated,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError("Property not found", httpStatus.NOT_FOUND);
  }

    if (property.landlordId !== landlordId) {
    throw new AppError('You are not authorized to update this property', httpStatus.FORBIDDEN);
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      ...payload,
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

  return updatedProperty;
};

export const landLordService = {
  createPropertyIntoDB,
  updatePropertyInDB,
};
