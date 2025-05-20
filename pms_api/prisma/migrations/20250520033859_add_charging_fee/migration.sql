-- AlterTable
ALTER TABLE "parking_requests" ADD COLUMN     "charged_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "check_out" DROP NOT NULL;

-- AlterTable
ALTER TABLE "parking_slots" ADD COLUMN     "charging_fee" DOUBLE PRECISION NOT NULL DEFAULT 0;
