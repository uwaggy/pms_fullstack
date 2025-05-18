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
        // get where role is user
        const filteredUserData = userData.filter((user:Users) => user.role === "USER");
        setUserCount(filteredUserData.length); 
        // setUserCount(userData.length);
        const slotData = await getAllSlots();
        setSlotCount(slotData.data.length);
        console.log("slotCount", slotData);
        // get where isAvailable is true
        const availableSlots = slotData.data.filter((slot:Slots) => slot.isAvailable === true);
        setAvailableSlots(availableSlots.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Dashboard Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Number of Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-black">{userCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Number of slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-black">{slotCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-black">{availableSlots}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
