import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Download, Receipt, Ticket, Car } from "lucide-react";
import { toast } from "sonner";
import { generateBill, generateTicket } from "../../services/vehicleService";

interface BillsTicketsTabProps {
  vehicles: any[];
  onSpaceUpdate: () => void;
}

export function BillsTicketsTab({ vehicles, onSpaceUpdate }: BillsTicketsTabProps) {
  const [activeTab, setActiveTab] = useState("bills");

  const handleGenerateBill = async (vehicleId: string) => {
    try {
      await generateBill(vehicleId);
      toast.success("Bill generated successfully");
      onSpaceUpdate(); // Update parking spaces after bill generation
    } catch (error) {
      toast.error("Failed to generate bill");
    }
  };

  const handleGenerateTicket = async (vehicleId: string) => {
    try {
      await generateTicket(vehicleId);
      toast.success("Ticket generated successfully");
      onSpaceUpdate(); // Update parking spaces after ticket generation
    } catch (error) {
      toast.error("Failed to generate ticket");
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="bills" className="text-green-700">Bills</TabsTrigger>
        <TabsTrigger value="tickets" className="text-green-700">Tickets</TabsTrigger>
        <TabsTrigger value="active" className="text-green-700">Active Vehicles</TabsTrigger>
        <TabsTrigger value="history" className="text-green-700">History</TabsTrigger>
      </TabsList>

      <TabsContent value="bills">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles
            .filter(v => v.exitDateTime && v.chargedAmount > 0)
            .map((vehicle) => (
              <Card key={vehicle.id} className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
                  <CardTitle className="text-sm font-medium text-green-700">Parking Bill</CardTitle>
                  <Receipt className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Bill Number:</span>
                      <span className="font-medium text-green-700">{vehicle.billNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Plate Number:</span>
                      <span className="font-medium text-green-700">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Duration:</span>
                      <span className="font-medium text-green-700">{formatDuration(vehicle.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Amount:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.chargedAmount ? `$${vehicle.chargedAmount.toFixed(2)}` : "—"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-green-200 hover:bg-green-50 text-green-700"
                      onClick={() => handleGenerateBill(vehicle.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Bill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="tickets">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles
            .filter(v => v.entryDateTime && !v.exitDateTime)
            .map((vehicle) => (
              <Card key={vehicle.id} className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
                  <CardTitle className="text-sm font-medium text-green-700">Parking Ticket</CardTitle>
                  <Ticket className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Ticket Number:</span>
                      <span className="font-medium text-green-700">{vehicle.ticketNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Plate Number:</span>
                      <span className="font-medium text-green-700">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Entry Time:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.entryDateTime ? new Date(vehicle.entryDateTime).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Parking Code:</span>
                      <span className="font-medium text-green-700">{vehicle.parkingCode}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-green-200 hover:bg-green-50 text-green-700"
                      onClick={() => handleGenerateTicket(vehicle.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="active">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles
            .filter(v => v.entryDateTime && !v.exitDateTime)
            .map((vehicle) => (
              <Card key={vehicle.id} className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
                  <CardTitle className="text-sm font-medium text-green-700">Active Vehicle</CardTitle>
                  <Car className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Plate Number:</span>
                      <span className="font-medium text-green-700">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Parking Code:</span>
                      <span className="font-medium text-green-700">{vehicle.parkingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Entry Time:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.entryDateTime ? new Date(vehicle.entryDateTime).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Duration:</span>
                      <span className="font-medium text-green-700">
                        {formatDuration(vehicle.duration)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="history">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles
            .filter(v => v.exitDateTime)
            .map((vehicle) => (
              <Card key={vehicle.id} className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
                  <CardTitle className="text-sm font-medium text-green-700">Vehicle History</CardTitle>
                  <Car className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Plate Number:</span>
                      <span className="font-medium text-green-700">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Entry Time:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.entryDateTime ? new Date(vehicle.entryDateTime).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Exit Time:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.exitDateTime ? new Date(vehicle.exitDateTime).toLocaleString() : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Amount:</span>
                      <span className="font-medium text-green-700">
                        {vehicle.chargedAmount ? `$${vehicle.chargedAmount.toFixed(2)}` : "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
} 