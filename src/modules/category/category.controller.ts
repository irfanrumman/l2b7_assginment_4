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

export const categoryController = {
  createCategoryForProperty,
};