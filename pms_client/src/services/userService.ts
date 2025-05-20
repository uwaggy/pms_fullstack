import axios from "axios";
import axiosInstance from "../lib/axios";
import API_ENDPOINTS from "../constants/api";
import { toast } from "sonner";


export async function getAllUsers() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.users.all);
    toast.success("Users loaded successfully");
    console.log("Response --->", response.data.data.users);
    return response.data.data.users;
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to load users";
    toast.error(errorMessage);
    throw error;
  }
}


   export async function fetchUserProfile()  {
     try {
       const response = await axiosInstance.get(API_ENDPOINTS.auth.me);
       if (response.status === 200) {
         return response.data.data.user;
       }
     } catch (error) {
       console.error("Failed to fetch user profile", error);
     }
   };