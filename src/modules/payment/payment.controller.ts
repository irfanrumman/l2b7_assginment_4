import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";






const createPaymentSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const tenantId = req.user?.id as string;
  const payload = req.body;

  const result = await paymentService.createPaymentSessionIntoDB(
    tenantId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});



const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;
  const { sessionId } = req.body;

  const result = await paymentService.verifyPaymentFromDB(tenantId, sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status verified successfully",
    data: result,
  });
});





export const PaymentController = {
  createPaymentSession,
  verifyPayment,
};