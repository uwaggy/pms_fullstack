import { Router } from "express";
import parkingSlotController from "../controllers/parkingSlot.controller";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateParkingSlotDto, UpdateParkingSlotDto } from "../dtos/parkingSlot.dto";

const router = Router();

// Get all parking slots
router.get("/", checkLoggedIn, parkingSlotController.getAllParkingSlots);

// Get parking slot by ID
router.get("/:id", checkLoggedIn, parkingSlotController.getParkingSlotById);

// Create parking slot
router.post("/", checkLoggedIn, validationMiddleware(CreateParkingSlotDto), parkingSlotController.createParkingSlot);

// Update parking slot
router.put("/:id", checkLoggedIn, validationMiddleware(UpdateParkingSlotDto, true), parkingSlotController.updateParkingSlot);

// Delete parking slot
router.delete("/:id", checkLoggedIn, parkingSlotController.deleteParkingSlot);

// Get available parking slots
router.get("/available", checkLoggedIn, parkingSlotController.getAvailableParkingSlots);

export default router;
