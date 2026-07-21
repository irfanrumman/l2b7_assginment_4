/*
  Warnings:

  - Added the required column `moveOutDate` to the `rental_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_requests" ADD COLUMN     "moveOutDate" TIMESTAMP(3) NOT NULL;
