/*
  Warnings:

  - You are about to drop the column `charged_amount` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `check_in` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `check_out` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `parking_slot_id` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `plate_number` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `parking_requests` table. All the data in the column will be lost.
  - The `status` column on the `parking_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `parkingSlotId` to the `parking_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `parking_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `parking_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parking_requests" DROP CONSTRAINT "parking_requests_parking_slot_id_fkey";

-- AlterTable
ALTER TABLE "parking_requests" DROP COLUMN "charged_amount",
DROP COLUMN "check_in",
DROP COLUMN "check_out",
DROP COLUMN "created_at",
DROP COLUMN "parking_slot_id",
DROP COLUMN "plate_number",
DROP COLUMN "updated_at",
ADD COLUMN     "chargedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "checkIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "checkOut" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parkingSlotId" TEXT NOT NULL,
ADD COLUMN     "plateNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "parking_requests_parkingSlotId_idx" ON "parking_requests"("parkingSlotId");

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_parkingSlotId_fkey" FOREIGN KEY ("parkingSlotId") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
