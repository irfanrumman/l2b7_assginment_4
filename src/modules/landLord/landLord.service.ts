import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreatePropertiesByLandlord } from "./landLord.validation";
import httpStatus from "http-status";

 


const createPropertyIntoDB = async (
  landlordId: string,
  payload: CreatePropertiesByLandlord
) => {


  const category = await prisma.category.findUnique({
    where: { 
        id: payload.categoryId 
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
        bedrooms: payload.bedrooms,
        bathrooms: payload.bathrooms,
        amenities: payload.amenities,
        landlord: { connect: { id: landlordId } },
        category: { connect: { id: payload.categoryId } },
        ...(payload.image ? { image: payload.image } : {}),
        ...(payload.isAvailable !== undefined ? { isAvailable: payload.isAvailable } : {}),
    },
    include: {
        landlord: true,
        category: true,
    },  

})

  return createdProperty;

  return prisma.property.create({
    data: buildPropertyCreateData(payload, landlordId),
    include: {
      landlord: true,
      category: true,
    },
  });



const buildPropertyCreateData = (
  payload: CreatePropertyInput,
  landlordId: string
): Prisma.PropertyCreateInput => ({
  title: payload.title,
  description: payload.description,
  location: payload.location,
  price: payload.price,
  bedrooms: payload.bedrooms,
  bathrooms: payload.bathrooms,
  amenities: payload.amenities,
  landlord: { connect: { id: landlordId } },
  category: { connect: { id: payload.categoryId } },
  ...(payload.image ? { image: payload.image } : {}),
  ...(payload.isAvailable !== undefined ? { isAvailable: payload.isAvailable } : {}),
});



};

export const landLordService = {
  createPropertyIntoDB,
};
