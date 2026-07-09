import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
import { jwtUtils } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}


 export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ?
       req.cookies.accessToken 
       :
       req.headers.authorization?.startsWith("Bearer ") ? 
       req.headers.authorization?.split(" ")[1] 
       :  req.headers.authorization;

        

    if (!token) {
      throw new Error("you are not logged in! Please log in to get access.");
    }
  
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if(!verifiedToken.success) {
     throw new Error(verifiedToken.error);
   }


    const { id, name, email, role } = verifiedToken.data as JwtPayload;


    if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new Error("You do not have permission to perform this resource");
    }

   const user = await prisma.user.findUnique({
      where: {
        id,
        name,
        email,
        role,
      },
      
    });
   
    if (!user) {
      throw new Error("User not found, please log in again");
    }

    // if(user.activestatus === "BLOCKED") {
    //   throw new Error("Your account has been blocked. Please contact support.");
    // }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};