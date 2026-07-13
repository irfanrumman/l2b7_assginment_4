import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
import { jwtUtils } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Role } from "../../prisma/generated/prisma/enums";
import { AppError } from "../utils/AppError";
import httpStatus from "http-status";

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
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        httpStatus.UNAUTHORIZED,
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new AppError(verifiedToken.error, httpStatus.UNAUTHORIZED);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        "You do not have permission to access this resource",
        httpStatus.FORBIDDEN,
      );
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
      throw new AppError(
        "User not found, please log in again",
        httpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === "BANNED") {
      throw new AppError(
        "Your account has been banned. Please contact support.",
        httpStatus.FORBIDDEN,
      );
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};
