import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../constants/api";

interface ParkingSlot {
  id: string;
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  chargingFee: number;
}

const ParkingList: React.FC = () => {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.parkingSlots.all);
      setParkingSlots(response.data.data.parkingSlots);
    } catch {
      toast.error("Failed to fetch parking slots");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Parking Slots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkingSlots.map((slot) => (
          <div
            key={slot.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold">{slot.name}</h3>
            <p className="text-gray-600">Code: {slot.code}</p>
            <p className="text-gray-600">Location: {slot.location}</p>
            <p className="text-gray-600">
              Available Spaces: {slot.availableSpaces} / {slot.totalSpaces}
            </p>
            <p className="text-green-600 font-semibold">
              Charging Fee: ${slot.chargingFee}/hour
            </p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${(slot.availableSpaces / slot.totalSpaces) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList; 