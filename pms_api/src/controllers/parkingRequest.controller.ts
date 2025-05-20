import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { AuthRequest } from "../types";
import { CreateParkingRequestDTO, UpdateParkingRequestDTO } from "../dtos/parkingRequest.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { sendParkingSlotConfirmationEmail, sendRejectionEmail } from "../utils/mail";

// Register car entry
const registerCarEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return ServerResponse.error(res, "User not authenticated", 401);
    }

    const { plateNumber, parkingCode } = req.body;

    // Find parking slot by code
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { code: parkingCode },
    });

    if (!parkingSlot) {
      return ServerResponse.error(res, "Parking slot not found", 404);
    }

    if (parkingSlot.availableSpaces <= 0) {
      return ServerResponse.error(res, "No available spaces", 400);
    }

    // Check if car is already parked
    const existingParking = await prisma.parkingRequest.findFirst({
      where: {
        plateNumber,
        checkOut: null,
      },
    });

    if (existingParking) {
      return ServerResponse.error(res, "Car is already parked", 400);
    }

    // Create parking request
    const parkingRequest = await prisma.parkingRequest.create({
      data: {
        plateNumber,
        parkingSlotId: parkingSlot.id,
        userId: req.user.id,
        checkIn: new Date(),
        chargedAmount: 0,
        status: "PENDING",
      },
    });

    // Update available spaces
    await prisma.parkingSlot.update({
      where: { id: parkingSlot.id },
      data: {
        availableSpaces: parkingSlot.availableSpaces - 1,
      },
    });

    return ServerResponse.created(res, "Car entry registered successfully", { parkingRequest });
  } catch (error) {
    console.error("Error registering car entry:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Register car exit
const registerCarExit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return ServerResponse.error(res, "User not authenticated", 401);
    }

    const { plateNumber, parkingCode } = req.body;

    // Find parking slot by code
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { code: parkingCode },
    });

    if (!parkingSlot) {
      return ServerResponse.error(res, "Parking slot not found", 404);
    }

    // Find active parking request
    const parkingRequest = await prisma.parkingRequest.findFirst({
      where: {
        plateNumber,
        parkingSlotId: parkingSlot.id,
        checkOut: null,
      },
    });

    if (!parkingRequest) {
      return ServerResponse.error(res, "No active parking request found", 404);
    }

    // Calculate duration and charge
    const checkOut = new Date();
    const duration = (checkOut.getTime() - parkingRequest.checkIn.getTime()) / (1000 * 60 * 60); // in hours
    const chargedAmount = Number((duration * parkingSlot.chargingFee).toFixed(2));

    // Update parking request
    const updatedRequest = await prisma.parkingRequest.update({
      where: { id: parkingRequest.id },
      data: {
        checkOut,
        chargedAmount,
        status: "APPROVED",
      },
    });

    // Update available spaces
    await prisma.parkingSlot.update({
      where: { id: parkingSlot.id },
      data: {
        availableSpaces: parkingSlot.availableSpaces + 1,
      },
    });

    return ServerResponse.success(res, "Car exit registered successfully", {
      parkingRequest: updatedRequest,
      duration: duration.toFixed(2),
      chargedAmount,
    });
  } catch (error) {
    console.error("Error registering car exit:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get all parking requests
const getAllParkingRequests = async (req: Request, res: Response) => {
  try {
    const parkingRequests = await prisma.parkingRequest.findMany({
      include: {
        parkingSlot: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    return ServerResponse.success(res, "Parking requests fetched successfully", { parkingRequests });
  } catch (error) {
    console.error("Error fetching parking requests:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get parking requests by date range
const getParkingRequestsByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    const parkingRequests = await prisma.parkingRequest.findMany({
      where: {
        checkIn: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        parkingSlot: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    const totalCharged = parkingRequests.reduce((sum, request) => sum + request.chargedAmount, 0);
    const activeParkings = parkingRequests.filter(request => !request.checkOut);
    const completedParkings = parkingRequests.filter(request => request.checkOut);

    return ServerResponse.success(res, "Parking requests fetched successfully", {
      parkingRequests,
      summary: {
        totalEntries: parkingRequests.length,
        activeEntries: activeParkings.length,
        completedEntries: completedParkings.length,
        totalRevenue: totalCharged,
      },
    });
  } catch (error) {
    console.error("Error fetching parking requests by date range:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get active parking requests
const getActiveParkingRequests = async (req: Request, res: Response) => {
  try {
    const activeParkings = await prisma.parkingRequest.findMany({
      where: {
        checkOut: null,
      },
      include: {
        parkingSlot: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    return ServerResponse.success(res, "Active parking requests fetched successfully", { activeParkings });
  } catch (error) {
    console.error("Error fetching active parking requests:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get parking request by ID
const getParkingRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parkingRequest = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        parkingSlot: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!parkingRequest) {
      return ServerResponse.error(res, "Parking request not found", 404);
    }

    return ServerResponse.success(res, "Parking request fetched successfully", { parkingRequest });
  } catch (error) {
    console.error("Error fetching parking request:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Update parking request
const updateParkingRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const parkingRequest = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        parkingSlot: true,
      },
    });

    if (!parkingRequest) {
      return ServerResponse.error(res, "Parking request not found", 404);
    }

    const updatedRequest = await prisma.parkingRequest.update({
      where: { id },
      data: {
        status,
        checkOut: status === "APPROVED" ? new Date() : null,
      },
    });

    // If request is approved, update available spaces
    if (status === "APPROVED") {
      await prisma.parkingSlot.update({
        where: { id: parkingRequest.parkingSlotId },
        data: {
          availableSpaces: parkingRequest.parkingSlot.availableSpaces + 1,
        },
      });
    }

    return ServerResponse.success(res, "Parking request updated successfully", { parkingRequest: updatedRequest });
  } catch (error) {
    console.error("Error updating parking request:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Delete parking request
const deleteParkingRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parkingRequest = await prisma.parkingRequest.findUnique({
      where: { id },
      include: {
        parkingSlot: true,
      },
    });

    if (!parkingRequest) {
      return ServerResponse.error(res, "Parking request not found", 404);
    }

    // If the request is active, update available spaces
    if (!parkingRequest.checkOut) {
      await prisma.parkingSlot.update({
        where: { id: parkingRequest.parkingSlotId },
        data: {
          availableSpaces: parkingRequest.parkingSlot.availableSpaces + 1,
        },
      });
    }

    await prisma.parkingRequest.delete({
      where: { id },
    });

    return ServerResponse.success(res, "Parking request deleted successfully");
  } catch (error) {
    console.error("Error deleting parking request:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get user's parking requests
const getUserParkingRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return ServerResponse.error(res, "User not authenticated", 401);
    }

    const parkingRequests = await prisma.parkingRequest.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        parkingSlot: true,
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    return ServerResponse.success(res, "User's parking requests fetched successfully", { parkingRequests });
  } catch (error) {
    console.error("Error fetching user's parking requests:", error);
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const parkingRequestController = {
  registerCarEntry,
  registerCarExit,
  getAllParkingRequests,
  getParkingRequestsByDateRange,
  getActiveParkingRequests,
  getParkingRequestById,
  updateParkingRequest,
  deleteParkingRequest,
  getUserParkingRequests,
};

export default parkingRequestController;
