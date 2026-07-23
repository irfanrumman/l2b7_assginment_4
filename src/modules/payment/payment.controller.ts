import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import { PaymentQueryValidated } from "./payment.validation";
import { Role } from "../../../prisma/generated/prisma/enums";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;

    const result = await paymentService.createPaymentSessionIntoDB(
      tenantId,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

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

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;


  const rawBody = (req as any).rawBody ?? req.body;

  const result = await paymentService.handleStripeWebhook(rawBody, signature);

  res.status(httpStatus.OK).json(result);
});


const getMyPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;
  const query = req.validatedQuery as PaymentQueryValidated;

  const result = await paymentService.getMyPaymentHistoryFromDB(
    tenantId,
    query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result,
  });
});



const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id as string;
    const userId = req.user?.id as string;
    const role = req.user?.role as Role; 

    const result = await paymentService.getPaymentByIdFromDB(
      paymentId,
      userId,
      role,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const PaymentController = {
  createPaymentSession,
  verifyPayment,
  stripeWebhook,
  getMyPaymentHistory,
  getPaymentById,
};
