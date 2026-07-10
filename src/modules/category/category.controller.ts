import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



const createCategoryForProperty =  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
    const categoryData = req.body;

    const result = await categoryService.createCategoryProperty(categoryData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });


});

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
});


const getSingleCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    const result = await categoryService.getSingleCategoryFromDB(categoryId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: result,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const categoryId = req.params.id;

    const result = await categoryService.updateCategoryInDB(categoryId as string, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
});



const categoryDelete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;

    await categoryService.deleteCategoryFromDB(categoryId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: null,
    });
});




export const categoryController = {
  createCategoryForProperty,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    categoryDelete,
};