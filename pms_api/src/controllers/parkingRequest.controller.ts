import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { CreateParkingRequestDTO, UpdateParkingRequestDTO } from "../dtos/parkingRequest.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { sendParkingSlotConfirmationEmail, sendRejectionEmail } from "../utils/mail";

//Converts incoming data (req.body) into a CreateParkingRequestDTO instance and validates it using class-validator.
//If validation fails, return a 400 error with the validation errors.
const createParkingRequest = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateParkingRequestDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Check if vehicle belongs to  authenticated user
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: dto.vehicleId },
        });
        if (!vehicle || vehicle.userId !== (req as any).user.id) {
            return res.status(403).json({ message: "Unauthorized vehicle" });
        }

        // Inserts a new parkingRequest record into the database with status PENDING, the current user ID, vehicle ID, and checkIn/checkOut times.
        const parkingRequest = await prisma.parkingRequest.create({
            data: {
                userId: (req as any).user.id,
                vehicleId: dto.vehicleId,
                checkIn: new Date(dto.checkIn),
                checkOut: new Date(dto.checkOut),
                status: "PENDING",
            },
        });

        return res.status(201).json(parkingRequest);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create parking request", error });
    }
};

//Fetches parking requests where the userId matches the current user
//Related parkingSlot and vehicle are joined in the query.
const getUserParkingRequests = async (req: Request, res: Response) => {
    try {
        const requests = await prisma.parkingRequest.findMany({
            where: { userId: (req as any).user.id },
            include: { parkingSlot: true, vehicle: true },
        });
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch parking requests", error });
    }
};


//Retrieves all parking requests and Fetches associated parkingSlot, vehicle, and user info.
const getAllParkingRequests = async (req: Request, res: Response) => {
    try {
        const requests = await prisma.parkingRequest.findMany({
            include: { parkingSlot: true, vehicle: true, user: true },
        });
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch parking requests", error });
    }
};

//Look up the request by ID. If not found, return 404.Ensure it’s still PENDING. Otherwise, return 400

const approveParkingRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const request = await prisma.parkingRequest.findUnique({
            where: { id },
            include: { parkingSlot: true },
        });
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.status !== "PENDING") {
            return res.status(400).json({ message: "Request already processed" });
        }

        //Search for any parkingSlot where isAvailable is true.
//If none available, return a 400 message
        const availableSlot = await prisma.parkingSlot.findFirst({
            where: { isAvailable: true },
        });
        if (!availableSlot) {
            return res.status(400).json({ message: "No available parking slots" });
        }

        // Search for any parkingSlot where isAvailable is true.
//If none available, return a 400 message then send an verifcation email
        await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
                parkingSlotId: availableSlot.id,
            },
        });

        //Retrieve the user and send them a confirmation email with the slot number.
        const user = await prisma.user.findUnique({
            where: { id: request.userId },
        });
        if (user) {
            await sendParkingSlotConfirmationEmail(user.email,user.names, availableSlot.slotNumber);
        }
    

        // Mark slot as unavailable
        await prisma.parkingSlot.update({
            where: { id: availableSlot.id },
            data: { isAvailable: false },
        });

        return res.status(200).json({ message: "Request approved", slotNumber: availableSlot.slotNumber });
    } catch (error) {
        return res.status(500).json({ message: "Error approving request", error });
    }
};



//Retrieve by ID Return 404 if not found Ensure it’s still PENDING If not, return 400 Set status to REJECTED.
const rejectParkingRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const request = await prisma.parkingRequest.findUnique({
            where: { id },
        });
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.status !== "PENDING") {
            return res.status(400).json({ message: "Request already processed" });
        }

        await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: "REJECTED",
            },
        });

        //send rejection email to user
        const user = await prisma.user.findUnique({
            where: { id: request.userId },
        });
        if (user) {
            await sendRejectionEmail(user.email, user.names);
        }

        return res.status(200).json({ message: "Request rejected" });
    } catch (error) {
        return res.status(500).json({ message: "Error rejecting request", error });
    }
};

const parkingRequestController = {
    createParkingRequest,
    getUserParkingRequests,
    getAllParkingRequests,
    approveParkingRequest,
    rejectParkingRequest,
};

export default parkingRequestController;
