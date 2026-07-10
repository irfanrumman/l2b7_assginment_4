import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCategoryForProperty, UpdateCategoryValidated } from "./category.validation";
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


const getAllCategoriesFromDB = async () => {

    const result = await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },

    });

  return result;
};



const getSingleCategoryFromDB = async (categoryId: string) => {

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new AppError("Category not found", httpStatus.NOT_FOUND);
    }

    return category;
};

const updateCategoryInDB = async (categoryId: string, updateData: UpdateCategoryValidated) => {

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new AppError("Category not found", httpStatus.NOT_FOUND);
    }

    const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: updateData,
    });

    return updatedCategory;
};


const deleteCategoryFromDB = async (categoryId: string) => {

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new AppError("Category not found", httpStatus.NOT_FOUND);
    }

    const deletedCategory = await prisma.category.delete({
        where: { id: categoryId },
    });

    return deletedCategory;
};


export const categoryService = {
  createCategoryProperty,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
