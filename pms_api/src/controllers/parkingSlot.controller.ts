import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { AuthRequest } from "../types";

// Create parking slot
const createParkingSlot = async (req: Request, res: Response) => {
  try {
    const { code, name, location, totalSpaces, chargingFee } = req.body;

    // Validate required fields
    if (!code || !name || !location || !totalSpaces || chargingFee === undefined) {
      return ServerResponse.error(res, "All fields are required", 400);
    }

    // Create parking slot
    const parkingSlot = await prisma.parkingSlot.create({
      data: {
        code,
        name,
        location,
        totalSpaces,
        availableSpaces: totalSpaces, // Initially, all spaces are available
        chargingFee,
      },
    });

    return ServerResponse.created(res, "Parking slot created successfully", { parkingSlot });
  } catch (error: any) {
    if (error.code === "P2002") {
      return ServerResponse.error(res, "Parking code already exists", 400);
    }
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get all parking slots
const getAllParkingSlots = async (req: Request, res: Response) => {
  try {
    const parkingSlots = await prisma.parkingSlot.findMany({
      include: {
        _count: {
          select: {
            parkingRequests: {
              where: {
                checkOut: null,
              },
            },
          },
        },
      },
    });

    return ServerResponse.success(res, "Parking slots fetched successfully", { parkingSlots });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get parking slot by ID
const getParkingSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { id },
      include: {
        parkingRequests: {
          where: {
            checkOut: null,
          },
        },
      },
    });

    if (!parkingSlot) {
      return ServerResponse.error(res, "Parking slot not found", 404);
    }

    return ServerResponse.success(res, "Parking slot fetched successfully", { parkingSlot });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Update parking slot
const updateParkingSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, location, totalSpaces, chargingFee } = req.body;

    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { id },
      include: {
        parkingRequests: {
          where: {
            checkOut: null,
          },
        },
      },
    });

    if (!parkingSlot) {
      return ServerResponse.error(res, "Parking slot not found", 404);
    }

    const activeParkings = parkingSlot.parkingRequests.length;
    if (totalSpaces < activeParkings) {
      return ServerResponse.error(
        res,
        `Cannot reduce total spaces below ${activeParkings} (current active parkings)`,
        400
      );
    }

    const updatedSlot = await prisma.parkingSlot.update({
      where: { id },
      data: {
        code,
        name,
        location,
        totalSpaces,
        availableSpaces: totalSpaces - activeParkings,
        chargingFee,
      },
    });

    return ServerResponse.success(res, "Parking slot updated successfully", { parkingSlot: updatedSlot });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Delete parking slot
const deleteParkingSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { id },
      include: {
        parkingRequests: {
          where: {
            checkOut: null,
          },
        },
      },
    });

    if (!parkingSlot) {
      return ServerResponse.error(res, "Parking slot not found", 404);
    }

    if (parkingSlot.parkingRequests.length > 0) {
      return ServerResponse.error(
        res,
        "Cannot delete parking slot with active parkings",
        400
      );
    }

    await prisma.parkingSlot.delete({
      where: { id },
    });

    return ServerResponse.success(res, "Parking slot deleted successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get available parking slots
const getAvailableParkingSlots = async (req: Request, res: Response) => {
  try {
    const availableSlots = await prisma.parkingSlot.findMany({
      where: {
        availableSpaces: {
          gt: 0,
        },
      },
      include: {
        _count: {
          select: {
            parkingRequests: {
              where: {
                checkOut: null,
              },
            },
          },
        },
      },
    });

    return ServerResponse.success(res, "Available parking slots fetched successfully", {
      availableSlots,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Handle car entry
const handleCarEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return ServerResponse.error(res, "User not authenticated", 401);
    }
    const { plateNumber, parkingCode } = req.body;

    // Find parking slot
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
        checkOut: {
          equals: null,
        },
      },
    });

    if (existingParking) {
      return ServerResponse.error(res, "Car is already parked", 400);
    }

    // Create parking request (add userId)
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

    return ServerResponse.created(res, "Car entry recorded successfully", { parkingRequest });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Handle car exit
const handleCarExit = async (req: Request, res: Response) => {
  try {
    const { plateNumber, parkingCode } = req.body;

    // Find parking slot
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
        checkOut: {
          equals: null,
        },
      },
    });

    if (!parkingRequest) {
      return ServerResponse.error(res, "No active parking request found", 404);
    }

    // Calculate duration and charge
    const checkOut = new Date();
    const duration = (checkOut.getTime() - parkingRequest.checkIn.getTime()) / (1000 * 60 * 60); // in hours
    const chargedAmount = duration * parkingSlot.chargingFee;

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

    return ServerResponse.success(res, "Car exit recorded successfully", {
      parkingRequest: updatedRequest,
      duration: duration.toFixed(2),
      chargedAmount,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get parking report
const getParkingReport = async (req: Request, res: Response) => {
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
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    const totalCharged = parkingRequests.reduce((sum, request) => sum + request.chargedAmount, 0);
    const activeParkings = parkingRequests.filter(request => !request.checkOut);
    const completedParkings = parkingRequests.filter(request => request.checkOut);

    return ServerResponse.success(res, "Parking report generated successfully", {
      parkingRequests,
      totalCharged,
      activeParkings,
      completedParkings,
      summary: {
        totalEntries: parkingRequests.length,
        activeEntries: activeParkings.length,
        completedEntries: completedParkings.length,
        totalRevenue: totalCharged,
      },
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Get active parkings
const getActiveParkings = async (req: Request, res: Response) => {
  try {
    const activeParkings = await prisma.parkingRequest.findMany({
      where: {
        checkOut: {
          equals: null,
        },
      },
      include: {
        parkingSlot: true,
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

    return ServerResponse.success(res, "Active parkings fetched successfully", { activeParkings });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const parkingSlotController = {
  createParkingSlot,
  getAllParkingSlots,
  getParkingSlotById,
  updateParkingSlot,
  deleteParkingSlot,
  getAvailableParkingSlots,
  handleCarEntry,
  handleCarExit,
  getParkingReport,
  getActiveParkings,
};

export default parkingSlotController;
