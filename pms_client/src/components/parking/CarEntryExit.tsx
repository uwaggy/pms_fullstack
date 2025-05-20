import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import API_ENDPOINTS from "../../constants/api";
import { Input } from "../ui/input";

const entrySchema = z.object({
  plateNumber: z.string().min(1, { message: "Plate number is required" }),
  parkingCode: z.string().min(1, { message: "Parking code is required" }),
});

const exitSchema = z.object({
  plateNumber: z.string().min(1, { message: "Plate number is required" }),
  parkingCode: z.string().min(1, { message: "Parking code is required" }),
});

type EntryFormInputs = z.infer<typeof entrySchema>;
type ExitFormInputs = z.infer<typeof exitSchema>;

const CarEntryExit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"entry" | "exit">("entry");

  const {
    register: registerEntry,
    handleSubmit: handleSubmitEntry,
    formState: { errors: entryErrors, isSubmitting: isEntrySubmitting },
  } = useForm<EntryFormInputs>({
    resolver: zodResolver(entrySchema),
  });

  const {
    register: registerExit,
    handleSubmit: handleSubmitExit,
    formState: { errors: exitErrors, isSubmitting: isExitSubmitting },
  } = useForm<ExitFormInputs>({
    resolver: zodResolver(exitSchema),
  });

  const onEntrySubmit = async (data: EntryFormInputs) => {
    try {
      const response = await axios.post(API_ENDPOINTS.parkingSlots.entry, data);

      if (response.status !== 201) {
        toast.error(response.data.message || "Failed to record car entry");
        return;
      }

      toast.success("Car entry recorded successfully");
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

  const onExitSubmit = async (data: ExitFormInputs) => {
    try {
      const response = await axios.post(API_ENDPOINTS.parkingSlots.exit, data);

      if (response.status !== 200) {
        toast.error(response.data.message || "Failed to record car exit");
        return;
      }

      const { duration, chargedAmount } = response.data.data;
      toast.success(
        `Car exit recorded successfully. Duration: ${duration} hours, Charged: $${chargedAmount}`
      );
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
    <div className="w-full max-w-md mx-auto p-6 rounded space-y-6 bg-white text-black">
      <div className="flex space-x-4 mb-6">
        <Button
          onClick={() => setActiveTab("entry")}
          className={`flex-1 ${
            activeTab === "entry"
              ? "bg-green-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Car Entry
        </Button>
        <Button
          onClick={() => setActiveTab("exit")}
          className={`flex-1 ${
            activeTab === "exit"
              ? "bg-green-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Car Exit
        </Button>
      </div>

      {activeTab === "entry" ? (
        <form onSubmit={handleSubmitEntry(onEntrySubmit)} className="space-y-4">
          <div>
            <label htmlFor="entryPlateNumber" className="block mb-1 font-medium">
              Plate Number
            </label>
            <Input
              id="entryPlateNumber"
              type="text"
              {...registerEntry("plateNumber")}
              className="py-6"
            />
            {entryErrors.plateNumber && (
              <p className="text-green-600 text-sm mt-1">
                {entryErrors.plateNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="entryParkingCode" className="block mb-1 font-medium">
              Parking Code
            </label>
            <Input
              id="entryParkingCode"
              type="text"
              {...registerEntry("parkingCode")}
              className="py-6"
            />
            {entryErrors.parkingCode && (
              <p className="text-green-600 text-sm mt-1">
                {entryErrors.parkingCode.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isEntrySubmitting}
            className="w-full bg-green-600 hover:bg-green-300 py-6 focus:ring-green-500"
          >
            {isEntrySubmitting ? "Recording Entry..." : "Record Entry"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitExit(onExitSubmit)} className="space-y-4">
          <div>
            <label htmlFor="exitPlateNumber" className="block mb-1 font-medium">
              Plate Number
            </label>
            <Input
              id="exitPlateNumber"
              type="text"
              {...registerExit("plateNumber")}
              className="py-6"
            />
            {exitErrors.plateNumber && (
              <p className="text-green-600 text-sm mt-1">
                {exitErrors.plateNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="exitParkingCode" className="block mb-1 font-medium">
              Parking Code
            </label>
            <Input
              id="exitParkingCode"
              type="text"
              {...registerExit("parkingCode")}
              className="py-6"
            />
            {exitErrors.parkingCode && (
              <p className="text-green-600 text-sm mt-1">
                {exitErrors.parkingCode.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isExitSubmitting}
            className="w-full bg-green-600 hover:bg-green-300 py-6 focus:ring-green-500"
          >
            {isExitSubmitting ? "Recording Exit..." : "Record Exit"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CarEntryExit; 