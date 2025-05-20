import prisma from "../../prisma/prisma-client";
import { scheduleJob } from "node-schedule";

// Job to update parking slot availability
const updateParkingSlotAvailability = async () => {
  try {
    // Get all parking slots
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

    // Update each parking slot's available spaces
    for (const slot of parkingSlots) {
      const activeParkings = slot._count.parkingRequests;
      const availableSpaces = slot.totalSpaces - activeParkings;

      await prisma.parkingSlot.update({
        where: { id: slot.id },
        data: {
          availableSpaces,
        },
      });
    }

    console.log("Parking slot availability updated successfully");
  } catch (error) {
    console.error("Error updating parking slot availability:", error);
  }
};

// Schedule the job to run every minute
const scheduleParkingSlotAvailabilityJob = () => {
  scheduleJob("*/1 * * * *", updateParkingSlotAvailability);
};

export default scheduleParkingSlotAvailabilityJob;
