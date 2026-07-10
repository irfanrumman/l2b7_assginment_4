import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landLordService } from "./landLord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CreatePropertiesvalidated } from "./landLord.validation";



const createProperty = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

  const landlordId = req.user?.id; 
  const propertyData: CreatePropertiesvalidated = req.body; 

  const result = await landLordService.createPropertyIntoDB(landlordId as string, propertyData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});




export const landLordController = {
  createProperty,
};