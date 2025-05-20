import axios from "axios";
import axiosInstance from "../lib/axios";
import API_ENDPOINTS from "../constants/api";
import { toast } from "sonner";
import { Slots } from "@/components/tables/columns";

export interface ParkingSlotData {
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  chargingFee: number;
}

export async function getAllSlots() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.parkingSlots.all);
    toast.success("Parking slots loaded successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to load parking slots";
    toast.error(errorMessage);
    throw error;
  }
}

export async function createSlot(slotData: ParkingSlotData) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.parkingSlots.create, slotData);
    toast.success("Parking slot created successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to create parking slot";
    toast.error(errorMessage);
    throw error;
  }
}

export async function updateSlot(id: string, slotData: ParkingSlotData) {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.parkingSlots.update(id), slotData);
    toast.success("Parking slot updated successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to update parking slot";
    toast.error(errorMessage);
    throw error;
  }
}

export async function deleteSlot(id: string) {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.parkingSlots.delete(id));
    toast.success("Parking slot deleted successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to delete parking slot";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getSlotById(id: string) {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.parkingSlots.getById(id));
    return response.data;
  } catch (error) {
    console.error("Failed to get parking slot by ID", error);
    throw error;
  }
}

export async function getAvailableSlots() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.parkingSlots.available);
    toast.success("Available parking slots loaded successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to load available parking slots";
    toast.error(errorMessage);
    throw error;
  }
}
