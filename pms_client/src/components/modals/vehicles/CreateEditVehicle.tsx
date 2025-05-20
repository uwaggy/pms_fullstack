import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { createVehicle, updateVehicle } from "../../../services/vehicleService";
import { toast } from "sonner";

interface CreateEditVehicleProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleToEdit?: {
    id?: string;
    plateNumber: string;
    parkingCode: string;
    entryDateTime: string;
    exitDateTime: string | null;
    chargedAmount: number;
  } | null;
  onSuccess: () => void;
}

interface VehicleFormData {
  plateNumber: string;
  parkingCode: string;
  entryDateTime: string;
}

const CreateEditVehicle: React.FC<CreateEditVehicleProps> = ({
  isOpen,
  onOpenChange,
  vehicleToEdit,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      reset({
        plateNumber: vehicleToEdit.plateNumber,
        parkingCode: vehicleToEdit.parkingCode,
        entryDateTime: new Date(vehicleToEdit.entryDateTime).toISOString().slice(0, 16),
      });
    } else {
      reset({
        entryDateTime: new Date().toISOString().slice(0, 16),
      });
    }
  }, [vehicleToEdit, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    setLoading(true);
    try {
      if (vehicleToEdit) {
        await updateVehicle(vehicleToEdit.id || "", data);
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle({
          ...data,
          exitDateTime: null,
          chargedAmount: 0,
        });
        toast.success("Vehicle entry recorded successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save vehicle", error);
      toast.error("Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-700 font-semibold">
            {vehicleToEdit ? "Edit Vehicle" : "Register Car Entry"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-green-700">Plate Number</label>
            <Input 
              {...register("plateNumber", { required: true })} 
              className="border-green-200 focus:border-green-500"
              placeholder="Enter plate number"
            />
            {errors.plateNumber && (
              <p className="text-red-600">Plate Number is required</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-green-700">Parking Code</label>
            <Input 
              {...register("parkingCode", { required: true })} 
              className="border-green-200 focus:border-green-500"
              placeholder="Enter parking code"
            />
            {errors.parkingCode && (
              <p className="text-red-600">Parking Code is required</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-green-700">Entry Date/Time</label>
            <Input 
              type="datetime-local"
              {...register("entryDateTime", { required: true })} 
              className="border-green-200 focus:border-green-500"
            />
            {errors.entryDateTime && (
              <p className="text-red-600">Entry Date/Time is required</p>
            )}
          </div>

          <DialogFooter className="pt-4">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditVehicle;
