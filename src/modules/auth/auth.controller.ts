import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { AppError } from "../../utils/AppError";
import { UpdateUserProfile, UpdateUserProfile, updateUserProfileSchema } from "./auth.validation";





const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User Registered Successfully",
      data: { user },
    });
  });



  const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } =
      await authService.loginUserIntoDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // has to be set to true in production
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // has to be set to true in production
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Logged In Successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    throw new AppError('You are not logged in! Please log in to get access.', httpstatus.UNAUTHORIZED);
  }
    
    const {id, role} = req.user;

    const user = await authService.getMyProfileFromDB(id, role);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Profile Retrieved Successfully",
      data: { user },
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('You are not logged in! Please log in to get access.', httpstatus.UNAUTHORIZED);
  }
  
const updatedUser = await authService.updateMyProfileInDB(userId!, req.body as UpdateUserProfile);

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User Profile Updated Successfully",
    data: { user: updatedUser },
  });

  
});



  export const authController = {
    registerUser,
    loginUser,
    getMyProfile,
    updateMyProfile,
  };