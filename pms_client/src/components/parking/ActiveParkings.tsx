import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/api";

interface ParkingRequest {
  id: string;
  plateNumber: string;
  parkingSlot: {
    code: string;
    name: string;
    location: string;
  };
  checkIn: string;
  checkOut: string | null;
  chargedAmount: number;
}

const ActiveParkings: React.FC = () => {
  const [activeParkings, setActiveParkings] = useState<ParkingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveParkings = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.parkingRequests.active);
      setActiveParkings(response.data.data.activeParkings);
    } catch (error) {
      toast.error("Failed to fetch active parkings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveParkings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Currently Parked Vehicles</h2>
      {activeParkings.length === 0 ? (
        <p>No vehicles currently parked</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeParkings.map((parking) => (
            <div
              key={parking.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">
                Plate Number: {parking.plateNumber}
              </h3>
              <p>Parking Slot: {parking.parkingSlot.name}</p>
              <p>Location: {parking.parkingSlot.location}</p>
              <p>Check-in: {new Date(parking.checkIn).toLocaleString()}</p>
              <p>
                Duration:{" "}
                {Math.round(
                  (new Date().getTime() - new Date(parking.checkIn).getTime()) /
                    (1000 * 60 * 60)
                )}{" "}
                hours
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveParkings; 