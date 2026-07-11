import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { CreateReviewInput } from './review.validation';


// const createReviewIntoDB = async (tenantId: string, payload: CreateReviewInput) => {
//   const rentalRequest = await prisma.rentalRequest.findUnique({
//     where: { id: payload.rentalRequestId },
//     include: { review: true },
//   });


//   if (!rentalRequest) {
//     throw new AppError('Rental request not found', httpStatus.NOT_FOUND);
//   }

 
//   if (rentalRequest.tenantId !== tenantId) {
//     throw new AppError('You can only review your own rental requests', httpStatus.FORBIDDEN);
//   }


//   if (rentalRequest.status !== 'COMPLETED') {
//     throw new AppError(
//       'You can only leave a review after the rental is completed',
//       httpStatus.CONFLICT
//     );
//   }


//   if (rentalRequest.review) {
//     throw new AppError('You have already reviewed this rental', httpStatus.CONFLICT);
//   }

//   const review = await prisma.review.create({
//     data: {
//       tenantId,
//       propertyId: rentalRequest.propertyId,
//       rentalRequestId: payload.rentalRequestId,
//       rating: payload.rating,
//       comment: payload.comment,
//     },
//     include: {
//       property: { select: { id: true, title: true, location: true } },
//     },
//   });

//   return review;
// };


const createReviewIntoDB = async (
  tenantId: string,
  payload: CreateReviewInput
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      payment: true,
      review: true,
    },
  });

  // Check rental request
  if (!rentalRequest) {
    throw new AppError(
      "Rental request not found.",
      httpStatus.NOT_FOUND
    );
  }

  // Only the tenant who rented the property can review
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(
      "You can only review your own rental request.",
      httpStatus.FORBIDDEN
    );
  }

  // Payment must be completed
  if (
    !rentalRequest.payment ||
    rentalRequest.payment.status !== "PAID"
  ) {
    throw new AppError(
      "You can submit a review only after completing the payment.",
      httpStatus.BAD_REQUEST
    );
  }

  // Move-in date must be reached
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const moveInDate = new Date(rentalRequest.moveInDate);
  moveInDate.setHours(0, 0, 0, 0);

  if (today < moveInDate) {
    throw new AppError(
      "You can submit a review only after your move-in date.",
      httpStatus.BAD_REQUEST
    );
  }

  // Prevent duplicate review
  if (rentalRequest.review) {
    throw new AppError(
      "You have already submitted a review for this rental.",
      httpStatus.CONFLICT
    );
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: rentalRequest.propertyId,
      rentalRequestId: rentalRequest.id,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });

  return review;
};
export const reviewService = {
  createReviewIntoDB,
};