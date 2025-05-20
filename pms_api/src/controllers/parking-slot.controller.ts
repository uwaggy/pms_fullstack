import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { CreateParkingSlotDTO, UpdateParkingSlotDTO, ParkingEntryDTO, ParkingExitDTO, ParkingReportDTO } from "../dtos/parking-slot.dto";

// Create parking slot
const createParkingSlot = async (req: Request, res: Response) => {
  try {
    const { code, name, location, totalSpaces, chargingFee } = req.body as CreateParkingSlotDTO;

    const parkingSlot = await prisma.parkingSlot.create({
      data: {
        code,
        name,
        location,
        totalSpaces,
        availableSpaces: totalSpaces,
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

// Handle car entry
const handleCarEntry = async (req: Request, res: Response) => {
  try {
    const { plateNumber, parkingCode } = req.body as ParkingEntryDTO;

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
    const { plateNumber, parkingCode } = req.body as ParkingExitDTO;

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
        checkOut: null,
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
    const { startDate, endDate } = req.body as ParkingReportDTO;

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
        checkOut: null,
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
  handleCarEntry,
  handleCarExit,
  getParkingReport,
  getActiveParkings,
};

export default parkingSlotController; 