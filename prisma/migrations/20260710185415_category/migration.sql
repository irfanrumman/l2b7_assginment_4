/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `availabilityStatus` on the `properties` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "rental_requests" DROP CONSTRAINT "rental_requests_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "rental_requests" DROP CONSTRAINT "rental_requests_tenantId_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "availabilityStatus",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "PropertyAvailability";

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
