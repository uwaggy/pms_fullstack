import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus, Car, ParkingCircle } from "lucide-react";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "./columns";
import { useVehicles } from "../../hooks/useVehicles";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BillsTicketsTab } from "../../components/tabs/BillsTicketsTab";
// import { toast } from "sonner";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading, error, refetch } = useVehicles();
  const [totalSpaces, setTotalSpaces] = useState(100); // Example total spaces
  const [occupiedSpaces, setOccupiedSpaces] = useState(0);

  useEffect(() => {
    if (vehicles) {
      // Calculate occupied spaces (vehicles that have entered but not exited)
      const occupied = vehicles.filter(v => v.entryDateTime && !v.exitDateTime).length;
      setOccupiedSpaces(occupied);
    }
  }, [vehicles]);

  const handleSpaceUpdate = () => {
    refetch(); // Refresh vehicle data to update space counts
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Vehicle Management</h1>
        <Button
          onClick={() => navigate("/vehicles/create")}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Register Vehicle
        </Button>
      </div>

      {/* Parking Space Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">Total Spaces</CardTitle>
            <ParkingCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{totalSpaces}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">Occupied Spaces</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{occupiedSpaces}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">Available Spaces</CardTitle>
            <ParkingCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{totalSpaces - occupiedSpaces}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bills and Tickets Tab */}
      <div className="mb-8">
        <BillsTicketsTab vehicles={vehicles} onSpaceUpdate={handleSpaceUpdate} />
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={vehicles} />
      </div>
    </div>
  );
}
