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
import { createSlot, updateSlot } from "../../../services/slotService";

interface CreateEditSlotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slotToEdit?: {
    id?: string;
    code: string;
    name: string;
    location: string;
    totalSpaces: number;
    chargingFee: number;
  } | null;
  onSuccess: () => void;
}

interface SlotFormData {
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  chargingFee: number;
}

const CreateEditSlot: React.FC<CreateEditSlotProps> = ({
  isOpen,
  onOpenChange,
  slotToEdit,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlotFormData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slotToEdit) {
      reset({
        code: slotToEdit.code,
        name: slotToEdit.name,
        location: slotToEdit.location,
        totalSpaces: slotToEdit.totalSpaces,
        chargingFee: slotToEdit.chargingFee,
      });
    } else {
      reset({
        code: "",
        name: "",
        location: "",
        totalSpaces: 1,
        chargingFee: 0,
      });
    }
  }, [slotToEdit, reset]);

  const onSubmit = async (data: SlotFormData) => {
    setLoading(true);
    try {
      if (slotToEdit) {
        await updateSlot(slotToEdit.id || "", data);
      } else {
        await createSlot(data);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save slot", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{slotToEdit ? "Edit Parking Slot" : "Create Parking Slot"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Code</label>
            <Input
              {...register("code", { 
                required: "Code is required",
                minLength: { value: 3, message: "Code must be at least 3 characters" },
                maxLength: { value: 10, message: "Code must not exceed 10 characters" }
              })}
              placeholder="Enter slot code"
            />
            {errors.code && (
              <p className="text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Name</label>
            <Input
              {...register("name", { 
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
                maxLength: { value: 50, message: "Name must not exceed 50 characters" }
              })}
              placeholder="Enter parking name"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Location</label>
            <Input
              {...register("location", { 
                required: "Location is required",
                minLength: { value: 2, message: "Location must be at least 2 characters" },
                maxLength: { value: 100, message: "Location must not exceed 100 characters" }
              })}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Total Spaces</label>
            <Input
              type="number"
              {...register("totalSpaces", { 
                required: "Total spaces is required",
                min: { value: 1, message: "Total spaces must be at least 1" },
                valueAsNumber: true
              })}
              placeholder="Enter number of spaces"
            />
            {errors.totalSpaces && (
              <p className="text-red-600">{errors.totalSpaces.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Charging Fee (per hour)</label>
            <Input
              type="number"
              step="0.01"
              {...register("chargingFee", { 
                required: "Charging fee is required",
                min: { value: 0, message: "Charging fee must be at least 0" },
                valueAsNumber: true
              })}
              placeholder="Enter charging fee"
            />
            {errors.chargingFee && (
              <p className="text-red-600">{errors.chargingFee.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditSlot;
