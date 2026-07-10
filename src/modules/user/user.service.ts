import { Prisma } from "../../../generated/prisma/browser";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";




const getMyProfileFromDB = async (userId: string, role: Role) => {

  const includeOptions: Prisma.UserInclude =
    role === Role.LANDLORD
      ? { properties: true }
      : role === Role.TENANT
      ? { rentalRequests: true, reviews: true }
      : role === Role.ADMIN
      ? {}
      : {}; 
       
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: includeOptions
  });

  
    if (!user) {
    throw new AppError("User not found.", httpStatus.UNAUTHORIZED);
  }

  if(user.status === "BANNED") {
    throw new AppError("Your account has been banned. Please contact support.", httpStatus.FORBIDDEN);
  }

  return user;
};




const updateMyProfileInDB = async (userId: string, payload: any) => {
  
  const { name, email, phone } = payload;
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      phone,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
};