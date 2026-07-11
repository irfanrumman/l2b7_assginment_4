

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { PaymentProvider } from "../../../generated/prisma/enums";
import { stripe } from "../../utils/stripe";
import config from "../../config";




// ---------------- TENANT: Create Stripe checkout session for an approved rental ----------------



// const createPaymentSessionIntoDB = async (
//   tenantId: string,
//   payload: ICreatePayment
// ) => {
//   const rentalRequest = await prisma.rentalRequest.findUnique({
//     where: { id: payload.rentalRequestId },
//     include: { 
//         property: true, 
//         payment: true 
//     },
//   });

//   if (!rentalRequest) {
//     throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
//   }

  
//   if (rentalRequest.tenantId !== tenantId) {
//     throw new AppError("You do not have access to this rental request", httpStatus.FORBIDDEN);
//   }

//   if (rentalRequest.status !== "APPROVED") {
//     throw new AppError(
//       "Payment can only be made after the rental request is approved", httpStatus.CONFLICT)};

  
//   if (rentalRequest.payment?.PaymentStatus === "COMPLETED") {
//     throw new AppError("This rental request has already been paid for", httpStatus.CONFLICT);
//   }

//   const amount = Number(rentalRequest.property.price);

//   // stripe checkout session create
//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           unit_amount: Math.round(amount * 100), 
//           product_data: {
//             name: rentalRequest.property.title,
//             description: `Rental payment for ${rentalRequest.property.title}`,
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${config.app_url}/payment/cancel`,
//     metadata: {
//       rentalRequestId: rentalRequest.id,
//       tenantId,
//     },
//   });

//   if (!session.url) {
//     throw new AppError("Failed to create Stripe checkout session", httpStatus.INTERNAL_SERVER_ERROR);
//   }

  
//   const payment = await prisma.payment.upsert({
//     where: { rentalRequestId: rentalRequest.id },
//     update: {
//       transactionId: session.id,
//       amount,
//       method: "STRIPE",
//       status: "PENDING",
//     },
//     create: {
//       rentalRequestId: rentalRequest.id,
//       tenantId,
//       amount,
//       method: "STRIPE",
//       transactionId: session.id,
//       status: "PENDING",
//     },
//   });

//   return {
//     checkoutUrl: session.url,
//     sessionId: session.id,
//     payment,
//   };
// };


const createPaymentSessionIntoDB = async (
  tenantId: string,
  payload: { rentalRequestId: string; provider: PaymentProvider }
) => {

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { 
      property: true, 
      payment: true 
    },
  });

  if (!rentalRequest) {
    throw new AppError("Rental Request not found", httpStatus.NOT_FOUND);
  }
  
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError("You do not have access to this rental request", httpStatus.FORBIDDEN);
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new AppError("Payment can only be made after the rental request is approved", httpStatus.CONFLICT);
  }
  
  
  if (rentalRequest.payment?.status === "COMPLETED") {
    throw new AppError("This rental request has already been paid for", httpStatus.CONFLICT);
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
    throw new AppError("Failed to create Stripe checkout session", httpStatus.INTERNAL_SERVER_ERROR);
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

export const paymentService = {
  createPaymentSessionIntoDB,
};