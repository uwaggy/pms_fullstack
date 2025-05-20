import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";

// Create a new vehicle entry
const createVehicle = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return ServerResponse.error(res, "User not authenticated", 401);
        }

        const { plateNumber, parkingCode } = req.body;

        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber,
                parkingCode,
                entryDateTime: new Date(),
                exitDateTime: null,
                chargedAmount: 0,
                duration: null,
                ticketNumber: null,
                billNumber: null,
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            },
        });

        return ServerResponse.created(res, "Vehicle entry recorded successfully", { vehicle });
    } catch (error: any) {
        console.error("Error creating vehicle:", error);
        if (error.code === "P2002") {
            return ServerResponse.error(res, "Plate number already exists", 400);
        }
        return ServerResponse.error(res, "Error creating vehicle", { error: error.message });
    }
};

// Get all vehicles
const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
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
                entryDateTime: 'desc'
            }
        });

        return ServerResponse.success(res, "Vehicles fetched successfully", { vehicles });
    } catch (error: any) {
        console.error("Error fetching vehicles:", error);
        return ServerResponse.error(res, "Error fetching vehicles", { error: error.message });
    }
};

// Get vehicle by ID
const getVehicleById = async (req: Request, res: Response) => {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
            include: {
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

        if (!vehicle) {
            return ServerResponse.error(res, "Vehicle not found", 404);
        }

        return ServerResponse.success(res, "Vehicle fetched successfully", { vehicle });
    } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        return ServerResponse.error(res, "Error fetching vehicle", { error: error.message });
    }
};

// Update vehicle
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { plateNumber, parkingCode } = req.body;

        const vehicle = await prisma.vehicle.update({
            where: { id: req.params.id },
            data: {
                plateNumber,
                parkingCode,
            },
        });

        return ServerResponse.success(res, "Vehicle updated successfully", { vehicle });
    } catch (error: any) {
        console.error("Error updating vehicle:", error);
        if (error.code === "P2002") {
            return ServerResponse.error(res, "Plate number already exists", 400);
        }
        return ServerResponse.error(res, "Error updating vehicle", { error: error.message });
    }
};

// Record vehicle exit
const recordVehicleExit = async (req: Request, res: Response) => {
    try {
        const { chargedAmount } = req.body;
        const exitDateTime = new Date();

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
        });

        if (!vehicle) {
            return ServerResponse.error(res, "Vehicle not found", 404);
        }

        if (vehicle.exitDateTime) {
            return ServerResponse.error(res, "Vehicle has already exited", 400);
        }

        const duration = Math.round((exitDateTime.getTime() - vehicle.entryDateTime.getTime()) / (1000 * 60));

        const updatedVehicle = await prisma.vehicle.update({
            where: { id: req.params.id },
            data: {
                exitDateTime,
                chargedAmount,
                duration,
            },
        });

        return ServerResponse.success(res, "Vehicle exit recorded successfully", { vehicle: updatedVehicle });
    } catch (error: any) {
        console.error("Error recording vehicle exit:", error);
        return ServerResponse.error(res, "Error recording vehicle exit", { error: error.message });
    }
};

// Delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        await prisma.vehicle.delete({
            where: { id: req.params.id },
        });

        return ServerResponse.success(res, "Vehicle deleted successfully");
    } catch (error: any) {
        console.error("Error deleting vehicle:", error);
        return ServerResponse.error(res, "Error deleting vehicle", { error: error.message });
    }
};

// Generate ticket
const generateTicket = async (req: Request, res: Response) => {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
        });

        if (!vehicle) {
            return ServerResponse.error(res, "Vehicle not found", 404);
        }

        const ticketNumber = `TKT-${Date.now()}`;

        const updatedVehicle = await prisma.vehicle.update({
            where: { id: req.params.id },
            data: {
                ticketNumber,
            },
        });

        return ServerResponse.success(res, "Ticket generated successfully", { vehicle: updatedVehicle });
    } catch (error: any) {
        console.error("Error generating ticket:", error);
        return ServerResponse.error(res, "Error generating ticket", { error: error.message });
    }
};

// Generate bill
const generateBill = async (req: Request, res: Response) => {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: req.params.id },
        });

        if (!vehicle) {
            return ServerResponse.error(res, "Vehicle not found", 404);
        }

        if (!vehicle.exitDateTime) {
            return ServerResponse.error(res, "Cannot generate bill for vehicle that hasn't exited", 400);
        }

        const billNumber = `BILL-${Date.now()}`;

        const updatedVehicle = await prisma.vehicle.update({
            where: { id: req.params.id },
            data: {
                billNumber,
            },
        });

        return ServerResponse.success(res, "Bill generated successfully", { vehicle: updatedVehicle });
    } catch (error: any) {
        console.error("Error generating bill:", error);
        return ServerResponse.error(res, "Error generating bill", { error: error.message });
    }
};

const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    recordVehicleExit,
    deleteVehicle,
    generateTicket,
    generateBill,
};

export default vehicleController;
