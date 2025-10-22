import axios from "axios";
import { BASE_URL } from "./apiPaths";

/**
 * Axios instance with pre-configured settings for API communication
 * Includes automatic token attachment and global error handling
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || BASE_URL || "http://localhost:8080",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all outgoing requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage and add to Authorization header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles common HTTP errors globally across the application
 */
axiosInstance.interceptors.response.use(
  // Successful responses pass through unchanged
  (response) => response,

  // Handle error responses
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem("token");
        console.warn("Session expired. Please login again.");
      } else if (status === 500) {
        // Server error
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      // Network timeout
      console.error("Request timeout. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
