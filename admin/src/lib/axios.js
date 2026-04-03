import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export default axiosInstance