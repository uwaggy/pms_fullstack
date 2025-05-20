/*
  Warnings:

  - You are about to drop the column `approved_at` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `requested_at` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_id` on the `parking_requests` table. All the data in the column will be lost.
  - You are about to drop the column `is_available` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `slot_number` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `names` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `parking_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plate_number` to the `parking_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `parking_requests` table without a default value. This is not possible if the table is not empty.
  - Made the column `parking_slot_id` on table `parking_requests` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `available_spaces` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_spaces` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parking_requests" DROP CONSTRAINT "parking_requests_parking_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "parking_requests" DROP CONSTRAINT "parking_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parking_requests" DROP CONSTRAINT "parking_requests_vehicle_id_fkey";

-- DropIndex
DROP INDEX "parking_slots_slot_number_key";

-- DropIndex
DROP INDEX "users_telephone_key";

-- AlterTable
ALTER TABLE "parking_requests" DROP COLUMN "approved_at",
DROP COLUMN "requested_at",
DROP COLUMN "user_id",
DROP COLUMN "vehicle_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "plate_number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "parking_slot_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "is_available",
DROP COLUMN "slot_number",
ADD COLUMN     "available_spaces" INTEGER NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "total_spaces" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "names",
DROP COLUMN "telephone",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parking_slots_code_key" ON "parking_slots"("code");

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_parking_slot_id_fkey" FOREIGN KEY ("parking_slot_id") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
