import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { PaymentProvider, Role } from "../../../prisma/generated/prisma/enums";
import { stripe } from "../../utils/stripe";
import config from "../../config";
import Stripe from "stripe";
import { PaymentQueryValidated } from "./payment.validation";
import { Prisma } from "../../../prisma/generated/prisma/client";




const createPaymentSessionIntoDB = async (
  tenantId: string,
  payload: { rentalRequestId: string; provider: PaymentProvider },
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new AppError("Rental Request not found", httpStatus.NOT_FOUND);
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(
      "You do not have access to this rental request",
      httpStatus.FORBIDDEN,
    );
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new AppError(
      "Payment can only be made after the rental request is approved",
      httpStatus.CONFLICT,
    );
  }

  if (rentalRequest.payment?.status === "PAID") {
    throw new AppError(
      "This rental request has already been paid for",
      httpStatus.CONFLICT,
    );
  }

  const amount = Number(rentalRequest.property.price);

  // stripe checkout session create
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: rentalRequest.property.title,
            description: `Rental payment for ${rentalRequest.property.title}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId,
    },
  });

  if (!session.url) {
    throw new AppError(
      "Failed to create Stripe checkout session",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  const payment = await prisma.payment.upsert({
    where: { rentalRequestId: rentalRequest.id },
    update: {
      transactionId: session.id,
      amount,
      method: "CARD",
      provider: payload.provider,
      status: "PENDING",
    },
    create: {
      rentalRequestId: rentalRequest.id,
      //   tenantId,
      amount,
      method: "CARD",
      provider: payload.provider,
      transactionId: session.id,
      status: "PENDING",
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    payment,
  };
};

const verifyPaymentFromDB = async (tenantId: string, sessionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: sessionId,
    },
    include: {
      rentalRequest: {
        include: {
          tenant: {
            omit: {
              password: true,
            },
          },
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(
      "Payment not found for this session",
      httpStatus.NOT_FOUND,
    );
  }

  if (payment.rentalRequest.tenant.id !== tenantId) {
    throw new AppError(
      "You do not have access to this payment",
      httpStatus.FORBIDDEN,
    );
  }

  if (payment.status === "PAID") {
    return payment;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    const updated = await prisma.payment.update({
      where: { transactionId: sessionId },
      data: { status: session.status === "expired" ? "FAILED" : "PENDING" },
    });
    return updated;
  }

  const updated = await prisma.payment.update({
    where: { transactionId: sessionId },
    data: { status: "PAID", paidAt: new Date() },
  });

  return updated;
};



//stripe webhook handler
const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret || config.stripe_live_webhook_secret,
    );
  } catch (error) {
    throw new Error(
      `Webhook signature verification failed: ${(error as Error).message}`,
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: { transactionId: session.id },
        data: { status: "PAID", paidAt: new Date() },
      });
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: { transactionId: session.id },
        data: { status: "FAILED" },
      });
      break;
    }

    default:
     
      break;
  }

  return { received: true };
};


const getMyPaymentHistoryFromDB = async (
  tenantId: string,
  query: PaymentQueryValidated,
) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {
    rentalRequest: { tenantId },
    ...(query.status ? { status: query.status } : {}),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        rentalRequest: {
          include: {
            property: { select: { id: true, title: true, location: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//get singel payment by id

// const getPaymentByIdFromDB = async (
//   paymentId: string,
//   userId: string,
//   userRole: string
// ) => {
//   const payment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//     include: {
//       rentalRequest: {
//         include: { property: true },
//       },
//     },
//   });

//   if (!payment) {
//     throw new Error("Payment not found");
//   }

//   const isOwnerTenant = payment.tenantId === userId;
//   const isOwnerLandlord = payment.rentalRequest.property.landlordId === userId;
//   const isAdmin = userRole === "ADMIN";

//   if (!isOwnerTenant && !isOwnerLandlord && !isAdmin) {
//     throw new Error("You do not have access to this payment");
//   }

//   return payment;
// };

const getPaymentByIdFromDB = async (
  paymentId: string,
  userId: string,
  userRole: Role,
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found", httpStatus.NOT_FOUND);
  }

  const isOwnerTenant = payment.rentalRequest.tenantId === userId; // ← ফিক্স
  const isOwnerLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwnerTenant && !isOwnerLandlord && !isAdmin) {
    throw new AppError(
      "You do not have access to this payment",
      httpStatus.FORBIDDEN,
    );
  }

  return payment;
};

export const paymentService = {
  createPaymentSessionIntoDB,
  handleStripeWebhook,
  verifyPaymentFromDB,
  getMyPaymentHistoryFromDB,
  getPaymentByIdFromDB,
};
