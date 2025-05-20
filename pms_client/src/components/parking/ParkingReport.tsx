import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import API_ENDPOINTS from "../../constants/api";
import { Input } from "../ui/input";

const reportSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
});

type ReportFormInputs = z.infer<typeof reportSchema>;

interface ParkingRequest {
  id: string;
  plateNumber: string;
  parkingSlot: {
    name: string;
    code: string;
  };
  checkIn: string;
  checkOut: string | null;
  chargedAmount: number;
}

const ParkingReport: React.FC = () => {
  const [parkingRequests, setParkingRequests] = useState<ParkingRequest[]>([]);
  const [totalCharged, setTotalCharged] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormInputs>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormInputs) => {
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.parkingSlots.report, data);

      if (response.status !== 200) {
        toast.error(response.data.message || "Failed to generate report");
        return;
      }

      setParkingRequests(response.data.data.parkingRequests);
      setTotalCharged(response.data.data.totalCharged);
      toast.success("Report generated successfully");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded space-y-6 bg-white text-black">
      <h2 className="text-2xl font-semibold mb-4">Parking Report</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-1 font-medium">
              Start Date
            </label>
            <Input
              id="startDate"
              type="datetime-local"
              {...register("startDate")}
              className="py-6"
            />
            {errors.startDate && (
              <p className="text-green-600 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block mb-1 font-medium">
              End Date
            </label>
            <Input
              id="endDate"
              type="datetime-local"
              {...register("endDate")}
              className="py-6"
            />
            {errors.endDate && (
              <p className="text-green-600 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-300 py-6 focus:ring-green-500"
        >
          {isSubmitting ? "Generating Report..." : "Generate Report"}
        </Button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {parkingRequests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                Total Charged: ${totalCharged.toFixed(2)}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plate Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Charged Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parkingRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.plateNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.parkingSlot.name} ({request.parkingSlot.code})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(request.checkIn).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.checkOut
                            ? new Date(request.checkOut).toLocaleString()
                            : "Still Parked"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${request.chargedAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ParkingReport; 