import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PropertyGetValidated } from "./property.validation";
import { propertyService } from "./property.service";



const getAllProperties = catchAsync(async (req: Request, res: Response) => {


  const filters = req.validatedQuery as PropertyGetValidated;
  
  const result = await propertyService.getAllPropertiesFromDB(filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Properties retrieved successfully',
    data: result,
  });
});

export const propertyController = {
  getAllProperties,
};