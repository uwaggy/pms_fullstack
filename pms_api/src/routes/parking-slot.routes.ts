import { Router } from "express";
import parkingSlotController from "../controllers/parking-slot.controller";
import { validateRequest } from "../middleware/validate-request";
import { CreateParkingSlotDTO, UpdateParkingSlotDTO, ParkingEntryDTO, ParkingExitDTO, ParkingReportDTO } from "../dtos/parking-slot.dto";
import { authenticate } from "../middleware/auth";

const router = Router();

// Create parking slot
router.post(
  "/",
  authenticate,
  validateRequest({ body: CreateParkingSlotDTO }),
  parkingSlotController.createParkingSlot
);

// Get all parking slots
router.get("/", parkingSlotController.getAllParkingSlots);

// Get active parkings
router.get("/active", parkingSlotController.getActiveParkings);

// Handle car entry
router.post(
  "/entry",
  authenticate,
  validateRequest({ body: ParkingEntryDTO }),
  parkingSlotController.handleCarEntry
);

// Handle car exit
router.post(
  "/exit",
  authenticate,
  validateRequest({ body: ParkingExitDTO }),
  parkingSlotController.handleCarExit
);

// Get parking report
router.post(
  "/report",
  authenticate,
  validateRequest({ body: ParkingReportDTO }),
  parkingSlotController.getParkingReport
);

export default router; 