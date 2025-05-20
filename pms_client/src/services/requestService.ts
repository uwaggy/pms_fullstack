import axios from "axios";
import axiosInstance from "../lib/axios";
import API_ENDPOINTS from "../constants/api";
import { toast } from "sonner";
import { Requests } from "@/components/tables/columns";

export async function getAllRequests() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.parkingRequests.all);
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to load requests";
    toast.error(errorMessage);
    throw error;
  }
}

export async function createRequest(requestData: {
  vehicleId: string;
  parkingSlotId: string;
  checkIn: string;
}) {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.parkingRequests.entry,
      {
        ...requestData,
        checkOut: null,
        chargedAmount: 0,
        duration: 0,
      }
    );
    toast.success("Parking request created successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to create parking request";
    toast.error(errorMessage);
    throw error;
  }
}

export async function updateRequest(
  id: string,
  updateData: {
    vehicleId?: string;
    parkingSlotId?: string;
    checkIn?: string;
  }
) {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.parkingRequests.update(id), updateData);
    toast.success("Parking request updated successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to update parking request";
    toast.error(errorMessage);
    throw error;
  }
}

export async function deleteRequest(id: string) {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.parkingRequests.delete(id));
    toast.success("Parking request deleted successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to delete parking request";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getRequestById(id: string) {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.parkingRequests.getById(id));
    return response.data;
  } catch (error) {
    console.error("Failed to get parking request by ID", error);
    throw error;
  }
}

export async function approveRequest(id: string) {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.parkingRequests.approve(id));
    toast.success("Parking request approved successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to approve parking request";
    toast.error(errorMessage);
    throw error;
  }
}

export async function rejectRequest(id: string) {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.parkingRequests.reject(id));
    toast.success("Parking request rejected successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to reject parking request";
    toast.error(errorMessage);
    throw error;
  }
}

export async function recordRequestExit(id: string, checkOut: string, chargedAmount: number) {
  try {
    const response = await axiosInstance.put(
      API_ENDPOINTS.parkingRequests.exit,
      {
        id,
        checkOut,
        chargedAmount,
      }
    );
    toast.success("Parking request exit recorded successfully");
    return response.data;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to record parking request exit";
    toast.error(errorMessage);
    throw error;
  }
}
