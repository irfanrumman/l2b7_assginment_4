import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { GetAllUsersValidation } from "./admin.validation";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const filters = req.validatedQuery as GetAllUsersValidation; 

  const result = await adminService.getAllUsersFromDB(filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

export const adminController = {
  getAllUsers,
 
};