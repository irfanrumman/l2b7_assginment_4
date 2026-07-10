import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";
import httpstatus from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    throw new AppError('You are not logged in! Please log in to get access.', httpstatus.UNAUTHORIZED);
  }
    
    const {id, role} = req.user;

    const user = await userService.getMyProfileFromDB(id, role);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Profile Retrieved Successfully",
      data: { user },
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



  
});


export const userController = {
  getMyProfile,
  updateMyProfile,
}