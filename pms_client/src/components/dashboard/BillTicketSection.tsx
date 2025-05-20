import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Download, Receipt, Ticket } from "lucide-react";
import { toast } from "sonner";
import { generateBill, generateTicket } from "../../services/vehicleService";

interface BillTicketSectionProps {
  vehicleId: string;
  ticketNumber?: string;
  billNumber?: string;
  duration?: number;
  chargedAmount?: number;
  entryDateTime?: string;
  exitDateTime?: string;
}

export function BillTicketSection({
  vehicleId,
  ticketNumber,
  billNumber,
  duration,
  chargedAmount,
  entryDateTime,
  exitDateTime,
}: BillTicketSectionProps) {
  const handleGenerateTicket = async () => {
    try {
      const response = await generateTicket(vehicleId);
      toast.success("Ticket generated successfully");
      // You might want to refresh the data here
    } catch (error) {
      toast.error("Failed to generate ticket");
    }
  };

  const handleGenerateBill = async () => {
    try {
      const response = await generateBill(vehicleId);
      toast.success("Bill generated successfully");
      // You might want to refresh the data here
    } catch (error) {
      toast.error("Failed to generate bill");
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
          <CardTitle className="text-sm font-medium text-green-700">Parking Ticket</CardTitle>
          <Ticket className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Ticket Number:</span>
              <span className="font-medium text-green-700">{ticketNumber || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Entry Time:</span>
              <span className="font-medium text-green-700">
                {entryDateTime ? new Date(entryDateTime).toLocaleString() : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Duration:</span>
              <span className="font-medium text-green-700">{formatDuration(duration)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-green-200 hover:bg-green-50 text-green-700"
              onClick={handleGenerateTicket}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
          <CardTitle className="text-sm font-medium text-green-700">Parking Bill</CardTitle>
          <Receipt className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Bill Number:</span>
              <span className="font-medium text-green-700">{billNumber || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Exit Time:</span>
              <span className="font-medium text-green-700">
                {exitDateTime ? new Date(exitDateTime).toLocaleString() : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Amount:</span>
              <span className="font-medium text-green-700">
                {chargedAmount ? `$${chargedAmount.toFixed(2)}` : "—"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-green-200 hover:bg-green-50 text-green-700"
              onClick={handleGenerateBill}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 