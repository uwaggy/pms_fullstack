import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import API_ENDPOINTS from "../../../constants/api";
import { Input } from "../../ui/input";

const parkingSchema = z.object({
  code: z.string().min(1, { message: "Parking code is required" }),
  name: z.string().min(1, { message: "Parking name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  totalSpaces: z.number().min(1, { message: "Total spaces must be at least 1" }),
  chargingFee: z.number().min(0, { message: "Charging fee must be 0 or greater" }),
});

type ParkingFormInputs = z.infer<typeof parkingSchema>;

interface CreateParkingFormProps {
  onSuccess: () => void;
}

const CreateParkingForm: React.FC<CreateParkingFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParkingFormInputs>({
    resolver: zodResolver(parkingSchema),
  });

  const onSubmit = async (data: ParkingFormInputs) => {
    try {
      const response = await axios.post(API_ENDPOINTS.parking.create, data);

      if (response.status !== 201) {
        toast.error(response.data.message || "Failed to create parking slot");
        return;
      }

      toast.success("Parking slot created successfully");
      onSuccess();
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-6 rounded space-y-6 bg-white text-black"
    >
      <div>
        <h2 className="text-2xl font-semibold text-black">Register Parking</h2>
        <h1>Enter parking details</h1>
      </div>

      <div>
        <label htmlFor="code" className="block mb-1 font-medium">
          Parking Code
        </label>
        <Input
          id="code"
          type="text"
          {...register("code")}
          className="py-6"
        />
        {errors.code && (
          <p className="text-green-600 text-sm mt-1">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Parking Name
        </label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          className="py-6"
        />
        {errors.name && (
          <p className="text-green-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block mb-1 font-medium">
          Location
        </label>
        <Input
          id="location"
          type="text"
          {...register("location")}
          className="py-6"
        />
        {errors.location && (
          <p className="text-green-600 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="totalSpaces" className="block mb-1 font-medium">
          Total Spaces
        </label>
        <Input
          id="totalSpaces"
          type="number"
          min="1"
          {...register("totalSpaces", { valueAsNumber: true })}
          className="py-6"
        />
        {errors.totalSpaces && (
          <p className="text-green-600 text-sm mt-1">{errors.totalSpaces.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="chargingFee" className="block mb-1 font-medium">
          Charging Fee per Hour
        </label>
        <Input
          id="chargingFee"
          type="number"
          step="0.01"
          min="0"
          {...register("chargingFee", { valueAsNumber: true })}
          className="py-6"
        />
        {errors.chargingFee && (
          <p className="text-green-600 text-sm mt-1">{errors.chargingFee.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-300 py-6 focus:ring-green-500"
      >
        {isSubmitting ? "Creating..." : "Create Parking"}
      </Button>
    </form>
  );
};

export default CreateParkingForm; 