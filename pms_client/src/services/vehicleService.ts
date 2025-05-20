import axiosInstance from "../lib/axios";
import { Vehicle } from "../pages/vehicles/columns";
import { toast } from "sonner";

export const getAllVehicles = async () => {
  const response = await axiosInstance.get("/vehicles");
  toast.success("Vehicles loaded successfully");
  return response.data;
};

export const getVehicleById = async (id: string) => {
  const response = await axiosInstance.get(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (vehicleData: Partial<Vehicle>) => {
  const response = await axiosInstance.post("/vehicles", vehicleData);
  toast.success("Vehicle entry recorded successfully");
  return response.data;
};

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
  const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
  toast.success("Vehicle record updated successfully");
  return response.data;
};

export const deleteVehicle = async (id: string) => {
  const response = await axiosInstance.delete(`/vehicles/${id}`);
  toast.success("Vehicle record deleted successfully");
  return response.data;
};

export const recordVehicleExit = async (id: string, chargedAmount: number) => {
  const response = await axiosInstance.post(`/vehicles/${id}/exit`, { chargedAmount });
  toast.success("Vehicle exit recorded successfully");
  return response.data;
};

export const generateTicket = async (id: string) => {
  const response = await axiosInstance.get(`/vehicles/${id}/ticket`);
  return response.data;
};

export const generateBill = async (id: string) => {
  const response = await axiosInstance.get(`/vehicles/${id}/bill`);
  return response.data;
};
