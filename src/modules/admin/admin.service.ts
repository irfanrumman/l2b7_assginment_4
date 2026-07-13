import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  AdminPropertyGetValidated,
  AdminRentalQueryValidated,
  GetAllUsersValidation,
} from "./admin.validation";
import httpStatus from "http-status";

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
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
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
      orderBy: { createdAt: "desc" },
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

const updateUserStatusInDB = async (
  targetUserId: string,
  adminId: string,
  newStatus: "ACTIVE" | "BANNED",
) => {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  if (targetUserId === adminId) {
    throw new AppError(
      "You cannot change your own account status",
      httpStatus.FORBIDDEN,
    );
  }

  if (targetUser.role === "ADMIN") {
    throw new AppError(
      "Cannot change status of another admin account",
      httpStatus.FORBIDDEN,
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: newStatus },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getAllPropertiesForAdmin = async (filters: AdminPropertyGetValidated) => {
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

  const pageNumber = page && page > 0 ? page : 1;
  const pageSize = limit && limit > 0 ? limit : 10;

  const whereConditions: Prisma.PropertyWhereInput = {
    ...(location
      ? { location: { contains: location, mode: "insensitive" } }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(isAvailable !== undefined
      ? { availabilityStatus: isAvailable ? "AVAILABLE" : "RENTED" }
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
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      include: {
        landlord: {
          select: { id: true, name: true, email: true, phone: true },
        },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
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

const getAllRentalsForAdmin = async (filters: AdminRentalQueryValidated) => {
  const { status, page, limit } = filters;

  const pageNumber = page && page > 0 ? page : 1;
  const pageSize = limit && limit > 0 ? limit : 10;

  const whereConditions: Prisma.RentalRequestWhereInput = {
    ...(status ? { status } : {}),
  };

  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: whereConditions,
      include: {
        tenant: { select: { id: true, name: true, email: true, phone: true } },
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            landlord: { select: { id: true, name: true, email: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    }),
    prisma.rentalRequest.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    data: rentals,
  };
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllPropertiesForAdmin,
  getAllRentalsForAdmin,
};
