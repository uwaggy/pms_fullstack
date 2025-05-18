/*
  Warnings:

  - You are about to drop the column `is_available` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `model_id` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicle_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicle_requests` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "vehicle_status" AS ENUM ('PENDING', 'APPROVED');

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_requests" DROP CONSTRAINT "vehicle_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_requests" DROP CONSTRAINT "vehicle_requests_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_model_id_fkey";

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "is_available",
DROP COLUMN "model_id",
ADD COLUMN     "status" "vehicle_status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "actions";

-- DropTable
DROP TABLE "vehicle_models";

-- DropTable
DROP TABLE "vehicle_requests";

-- DropEnum
DROP TYPE "action_types";

-- CreateTable
CREATE TABLE "parking_slots" (
    "id" TEXT NOT NULL,
    "slot_number" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "parking_slot_id" TEXT,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "status" "request_status" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "parking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_slots_slot_number_key" ON "parking_slots"("slot_number");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_parking_slot_id_fkey" FOREIGN KEY ("parking_slot_id") REFERENCES "parking_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
