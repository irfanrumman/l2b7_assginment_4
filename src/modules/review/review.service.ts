import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { CreateReviewInput } from './review.validation';


const createReviewIntoDB = async (tenantId: string, payload: CreateReviewInput) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { review: true },
  });


  if (!rentalRequest) {
    throw new AppError('Rental request not found', httpStatus.NOT_FOUND);
  }

 
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError('You can only review your own rental requests', httpStatus.FORBIDDEN);
  }


  if (rentalRequest.status !== 'COMPLETED') {
    throw new AppError(
      'You can only leave a review after the rental is completed',
      httpStatus.CONFLICT
    );
  }


  if (rentalRequest.review) {
    throw new AppError('You have already reviewed this rental', httpStatus.CONFLICT);
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: rentalRequest.propertyId,
      rentalRequestId: payload.rentalRequestId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      property: { select: { id: true, title: true, location: true } },
    },
  });

  return review;
};

export const reviewService = {
  createReviewIntoDB,
};