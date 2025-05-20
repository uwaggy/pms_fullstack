import { Router } from "express";
import vehicleController from "../controllers/vehicle.controller";
import authenticate from "../middleware/auth";

const router = Router();

// Create a new vehicle entry
router.post("/", authenticate, vehicleController.createVehicle);

// Get all vehicles
router.get("/", authenticate, vehicleController.getAllVehicles);

// Get a specific vehicle by ID
router.get("/:id", authenticate, vehicleController.getVehicleById);

// Update a vehicle
router.put("/:id", authenticate, vehicleController.updateVehicle);

// Record vehicle exit
router.post("/:id/exit", authenticate, vehicleController.recordVehicleExit);

// Delete a vehicle
router.delete("/:id", authenticate, vehicleController.deleteVehicle);

export default router;
