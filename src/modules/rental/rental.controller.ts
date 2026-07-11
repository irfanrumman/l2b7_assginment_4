import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RentalRequestService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

;


const submitRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const tenantId = req.user?.id as string; 
  
  const result = await RentalRequestService.submitRentalRequestIntoDB(tenantId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED, 
    message: 'Rental request submitted successfully',
    data: result,
  });
});


export const rentalController = {
  submitRentalRequest,
};