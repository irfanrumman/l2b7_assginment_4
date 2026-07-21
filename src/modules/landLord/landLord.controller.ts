import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landLordService } from "./landLord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CreatePropertiesvalidated, RentalQueryValidated, UpdatePropertyValidated, UpdateRentalStatusValidated } from "./landLord.validation";



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

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string; 
    const propertyId = req.params.id as string; 
    const updateData: UpdatePropertyValidated = req.body;

    const result = await landLordService.updatePropertyInDB(propertyId, landlordId, updateData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: result,
    });
  }
);


const getRentalRequestsForLandlord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string; 
    const query = req.validatedQuery as RentalQueryValidated;
    const result = await landLordService.getLandlordRentalAllRequests(landlordId, query);
    // console.log("result", result);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests fetched successfully",
      data: result,
    });
  }
);


const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string; 
    const propertyId = req.params.id as string;

    await landLordService.deletePropertyFromDB(propertyId, landlordId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  }
);



const updateRentalStatus = catchAsync(async (req: Request, res: Response) => {

  const landlordId = req.user?.id as string;
  const rentalId = req.params.id as string;
  const { status } = req.body as UpdateRentalStatusValidated;

  const result = await landLordService.updateRentalStatusInDB(rentalId, landlordId, status);
  

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental request status updated successfully',
    data: result,
  });
});





export const landLordController = {
  createProperty,
  updateProperty,
  getRentalRequestsForLandlord,
    deleteProperty,
    updateRentalStatus,
};