import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { RentalRequestAllGetValidation } from "./rental.validation";

;


const createRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const tenantId = req.user?.id as string; 
  
  const result = await rentalRequestService.createRentalRequestIntoDB(tenantId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED, 
    message: 'Rental request submitted successfully',
    data: result,
  });
});





const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {

  const tenantId = req.user?.id as string; 
  const query = req.validatedQuery as RentalRequestAllGetValidation;

  const result = await rentalRequestService.getAllRentalRequestsForTenant(tenantId, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental requests fetched successfully',
    data: result,
  });
});




const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;
  const { id } = req.params as { id: string };

  const result = await rentalRequestService.getSingleRentalRequestFromDB(id, tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental request details fetched successfully',
    data: result,
  });
});



export const rentalController = {
  createRentalRequest,
  getAllRentalRequests,
  getRentalRequestById,
};