import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import {
  CreateRentalRequestValidation,
  RentalRequestAllGetValidation,
} from "./rental.validation";
import { Prisma } from "../../../prisma/generated/prisma/client";



const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: CreateRentalRequestValidation,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

 
  if (!property) {
    throw new AppError(
      "Property not found",
      httpStatus.NOT_FOUND,
    );
  }


  if (property.landlordId === tenantId) {
    throw new AppError(
      "You cannot submit a request for your own property",
      httpStatus.FORBIDDEN,
    );
  }

  
  if (!property.isAvailable) {
    const expiredRental = await prisma.rentalRequest.findFirst({
      where: {
        propertyId: property.id,
        status: {
          in: ["APPROVED", "ACTIVE"],
        },
        moveOutDate: {
          lte: new Date(),
        },
      },
      orderBy: {
        moveOutDate: "desc",
      },
    });
    

    
    if (expiredRental) {
      
      await prisma.rentalRequest.update({
        where: {
          id: expiredRental.id,
        },
        data: {
          status: "COMPLETED",
        },
      });

    
      await prisma.property.update({
        where: {
          id: property.id,
        },
        data: {
          isAvailable: true,
        },
      });

      property.isAvailable = true;
    }
  }

  
  if (!property.isAvailable) {
    throw new AppError(
      "This property is not available for rent",
      httpStatus.CONFLICT,
    );
  }


  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (existingRequest) {
    throw new AppError(
      "You already have an active request for this property",
      httpStatus.CONFLICT,
    );
  }

 
  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate: payload.moveInDate,
      moveOutDate: payload.moveOutDate,
      message: payload.message,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  return rentalRequest;
};


const getAllRentalRequestsForTenant = async (
  tenantId: string,
  query: RentalRequestAllGetValidation,
) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const where: Prisma.RentalRequestWhereInput = {
    tenantId,
    ...(query.status ? { status: query.status } : {}),
  };

  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            isAvailable: true,
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.rentalRequest.count({ where }),
  ]);

  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleRentalRequestFromDB = async (
  rentalId: string,
  tenantId: string,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          isAvailable: true,
          landlord: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      },
      payment: true,
      review: true,
    },
  });

  if (!rental) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      "You are not authorized to view this rental request",
      httpStatus.FORBIDDEN,
    );
  }

  return rental;
};

export const rentalRequestService = {
  createRentalRequestIntoDB,
  getAllRentalRequestsForTenant,
  getSingleRentalRequestFromDB,
};
