import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { getAllUsers } from "../../services/userService"; 
import { getAllSlots } from "../../services/slotService";
import { Slots, Users } from "../../components/tables/columns";

const DashboardPage: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [slotCount, setSlotCount] = useState<number>(0);
  const [availableSlots, setAvailableSlots] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getAllUsers();
        const filteredUserData = userData.filter((user:Users) => user.role === "USER");
        setUserCount(filteredUserData.length); 
        const slotData = await getAllSlots();
        setSlotCount(slotData.data.length);
        const availableSlots = slotData.data.filter((slot:Slots) => slot.isAvailable === true);
        setAvailableSlots(availableSlots.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 bg-green-50 min-h-screen p-8 rounded-lg">
      <h1 className="text-4xl font-extrabold text-green-600 drop-shadow-md">
        Dashboard 
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-green-600 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-green-600 font-semibold text-xl">
              Number of Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-700 tracking-wide">
              {userCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-600 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-green-600 font-semibold text-xl">
              Number of Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-700 tracking-wide">
              {slotCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-600 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-green-600 font-semibold text-xl">
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-green-700 tracking-wide">
              {availableSlots}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
