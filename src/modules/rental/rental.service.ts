import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { CreateRentalRequestValidation } from "./rental.validation";


  



const submitRentalRequestIntoDB = async (tenantId: string, payload: CreateRentalRequestValidation) => {

  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  
  if (!property) {
    throw new AppError('Property not found', httpStatus.NOT_FOUND);
  }

  
  if (!property.isAvailable) {
    throw new AppError('This property is not available for rent', httpStatus.CONFLICT);
  }

  
  if (property.landlordId === tenantId) {
    throw new AppError('You cannot submit a request for your own property', httpStatus.FORBIDDEN);
  }


  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: { in: ['PENDING', 'APPROVED'] },
    },
  });

  if (existingRequest) {
    throw new AppError('You already have an active request for this property', httpStatus.CONFLICT);
  }

  
  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      moveInDate: payload.moveInDate,
      message: payload.message,
    },
    include: {
      property: {
         select: { 
            id: true, 
            title: true, 
            location: true, 
            price: true 
        } 
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

export const RentalRequestService = { submitRentalRequestIntoDB };

export const rentalService = {
  submitRentalRequestIntoDB,
};