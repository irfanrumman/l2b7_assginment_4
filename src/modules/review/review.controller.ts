import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { reviewService } from './review.service';



const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.user?.id as string;

  const result = await reviewService.createReviewIntoDB(tenantId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review submitted successfully',
    data: result,
  });
});


export const reviewController = {
  createReview,
};