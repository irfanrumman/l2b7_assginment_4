import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landLordService } from "./landLord.service";
import { CreatePropertiesByLandlord } from "./landLord.validation";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

  const landlordId = req.user?.id; 
  const propertyData: CreatePropertiesByLandlord = req.body; 

  const result = await landLordService.createPropertyIntoDB(landlordId!, propertyData);

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