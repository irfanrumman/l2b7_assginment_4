import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminPropertyGetValidated, AdminRentalQueryValidated, GetAllUsersValidation, UpdateUserStatusValidated } from "./admin.validation";
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



const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const adminId = req.user?.id as string;

  const { id } = req.params as { id: string };
  const { status } = req.body as UpdateUserStatusValidated;

  const result = await adminService.updateUserStatusInDB(id, adminId, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User has been ${status === 'BANNED' ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});


const getAllPropertiesForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const filters = req.validatedQuery as AdminPropertyGetValidated;

  const result = await adminService.getAllPropertiesForAdmin(filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Properties retrieved successfully',
    data: result,
  });
});





const getAllRentalsForAdmin = catchAsync(async (req: Request, res: Response) => {

  const filters = req.validatedQuery as AdminRentalQueryValidated;

  const result = await adminService.getAllRentalsForAdmin(filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});





export const adminController = {
  getAllUsers,
    updateUserStatus,
    getAllPropertiesForAdmin,
    getAllRentalsForAdmin,
 
};