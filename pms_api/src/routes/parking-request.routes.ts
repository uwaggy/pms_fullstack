import { Router } from "express";
import parkingRequestController from "../controllers/parkingRequest.controller";
import { checkLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

// Register car entry
router.post("/entry", checkLoggedIn, parkingRequestController.registerCarEntry);

// Register car exit
router.post("/exit", checkLoggedIn, parkingRequestController.registerCarExit);

// Get all parking requests
router.get("/", checkLoggedIn, parkingRequestController.getAllParkingRequests);

// Get parking requests by date range
router.post("/date-range", checkLoggedIn, parkingRequestController.getParkingRequestsByDateRange);

// Get active parking requests
router.get("/active", checkLoggedIn, parkingRequestController.getActiveParkingRequests);

export default router; 