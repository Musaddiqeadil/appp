import axios from "axios";

// Base URL configuration
// const apiURL = "http://localhost:5000/api";
const apiURL = "https://trttierion-member-be.onrender.com/api";
// const apiURL = process.env.REACT_APP_API_URL;

// Create axios instance with base config
const api = axios.create({
  baseURL: apiURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for potential token injection
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please check your internet connection."
      );
    }
    if (!error.response) {
      throw new Error("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export const login = async (userId, password) => {
  try {
    const response = await api.post("/auth/login", { userId, password });
    return response.data;
  } catch (error) {
    // Ensure backend returns { message: "Invalid credentials" } on 401
    const message =
      error.response?.data?.message || "Invalid user ID or password";
    throw new Error(message); // This will be caught in submitLogin
  }
};

export const register = async (payload) => {
  console.log("Registration payload:", payload);
  try {
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error or server not responding");
    }
  }
};

export const getReferrerName = async (referrerId) => {
  try {
    const response = await api.get(`/referral/getreferralname/${referrerId}`);

    if (response.data.success) {
      return response.data.data.fullName;
    } else {
      throw new Error(response.data.message || "Failed to fetch referrer name");
    }
  } catch (error) {
    console.error("Referrer Fetch Error:", error);
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const verifyOtp = async ({ userId, otp }) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      userId,
      otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "OTP verification failed"
    );
  }
};

export default api;
