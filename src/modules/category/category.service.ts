import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCategoryForProperty } from "./category.validation";
import httpStatus from "http-status";

const createCategoryProperty = async (
  categoryData: CreateCategoryForProperty,
) => {
  const normalizedName = categoryData.name.trim().toLowerCase();

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists", httpStatus.CONFLICT);
  }

  const result = await prisma.category.create({
    data: {
      ...categoryData,
      name: normalizedName,
    },
  });
  return result;
};





export const categoryService = {
  createCategoryProperty,
};
