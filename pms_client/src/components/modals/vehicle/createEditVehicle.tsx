import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { createVehicle, updateVehicle } from "../../services/vehicleService";
import { toast } from "sonner";
import { Vehicle } from "../../components/tables/columns";

interface CreateEditVehicleProps {
  isOpen: boolean;
  vehicleToEdit: Vehicle | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateEditVehicle({
  isOpen,
  vehicleToEdit,
  onOpenChange,
  onSuccess,
}: CreateEditVehicleProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: vehicleToEdit?.plateNumber || "",
    parkingCode: vehicleToEdit?.parkingCode || "",
    entryDateTime: vehicleToEdit?.entryDateTime 
      ? new Date(vehicleToEdit.entryDateTime).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vehicleToEdit) {
        await updateVehicle(vehicleToEdit.id!, formData);
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle({
          ...formData,
          exitDateTime: null,
          chargedAmount: 0,
        });
        toast.success("Vehicle entry recorded successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-700 font-semibold">
            {vehicleToEdit ? "Edit Vehicle" : "Register Car Entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber" className="text-green-700">Plate Number</Label>
            <Input
              id="plateNumber"
              value={formData.plateNumber}
              onChange={(e) =>
                setFormData({ ...formData, plateNumber: e.target.value })
              }
              required
              placeholder="Enter plate number"
              className="border-green-200 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingCode" className="text-green-700">Parking Code</Label>
            <Input
              id="parkingCode"
              value={formData.parkingCode}
              onChange={(e) =>
                setFormData({ ...formData, parkingCode: e.target.value })
              }
              required
              placeholder="Enter parking code"
              className="border-green-200 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryDateTime" className="text-green-700">Entry Date/Time</Label>
            <Input
              id="entryDateTime"
              type="datetime-local"
              value={formData.entryDateTime}
              onChange={(e) =>
                setFormData({ ...formData, entryDateTime: e.target.value })
              }
              required
              className="border-green-200 focus:border-green-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-green-200 hover:bg-green-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-green-700 hover:bg-green-800"
            >
              {loading ? "Saving..." : vehicleToEdit ? "Update" : "Register Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 