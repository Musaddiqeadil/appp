import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Base API configuration
const apiURL = "https://trttierion-member-be.onrender.com/api";

// Helper function to handle storage
const getStoredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// Authenticated request (requires token)
export const MakeAuthenticationRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  try {
    const storedUser = await getStoredUser();

    if (!storedUser || !storedUser.token) {
      await AsyncStorage.removeItem("userData");
      throw new Error("User is not authenticated");
    }

    const config = {
      method,
      url: `${apiURL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${storedUser.token}`,
        "Content-Type": "application/json",
      },
      data,
    };

    const response = await axios(config);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      // Handle non-success status codes
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("API Error:", error);

    // Handle token expiration or invalid token
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("userData");
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please login again.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    }

    // Throw error with proper message
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to make authenticated request";
    throw new Error(errorMessage);
  }
};

// Unauthenticated request (no token)
export const MakeRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const config = {
      method,
      url: `${apiURL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };

    const response = await axios(config);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to make request";
    throw new Error(errorMessage);
  }
};

// User Profile API
export const getUserProfile = async () => {
  try {
    const response = await MakeAuthenticationRequest("/user/get-profile");

    // Check if response has the expected structure
    if (!response || !response.data) {
      throw new Error("Invalid profile data structure");
    }

    // Return the entire response since your component expects response.data
    return response;
  } catch (error) {
    console.error("Profile Error:", error);
    throw error;
  }
};

export const updateUserProfile = async (updateData) => {
  try {
    const response = await MakeAuthenticationRequest(
      "/user/update-profile",
      "PUT",
      updateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Referral API
export const getReferralList = async (depthLimit) => {
  try {
    const response = await MakeAuthenticationRequest(
      "/referral/getreferrals",
      "POST",
      { depthLimit }
    );
    return response.data;
  } catch (error) {
    console.error("Referral Error:", error);
    throw error;
  }
};

// Dashboard API
export const getDashboard = async () => {
  try {
    const response = await MakeAuthenticationRequest("/user/get-dashboard");
    return response.data;
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw error;
  }
};

// Packages API
export const getPackages = async () => {
  try {
    const response = await MakeAuthenticationRequest(
      "/package/get-all-package"
    );
    return response.data;
  } catch (error) {
    console.error("Packages Error:", error);
    throw error;
  }
};

export const createPackage = async (packageAmount) => {
  try {
    const response = await MakeAuthenticationRequest(
      "/package/create-package",
      "POST",
      { packageAmount }
    );
    return response.data;
  } catch (error) {
    console.error("Create Package Error:", error);
    throw error;
  }
};

// Transactions API
export const getTransactions = async (transactionRemark, type, walletName) => {
  try {
    const response = await MakeAuthenticationRequest(
      "/transaction/get-transaction",
      "POST",
      { transactionRemark, walletName, type }
    );
    return response.data;
  } catch (error) {
    console.error("Transactions Error:", error);
    throw error;
  }
};

// Wallet API
export const getWallet = async () => {
  try {
    const response = await MakeAuthenticationRequest("/user/get-wallet");
    return response.data;
  } catch (error) {
    console.error("Wallet Error:", error);
    throw error;
  }
};

export const withdrawUSDT = async (amount) => {
  try {
    const response = await MakeAuthenticationRequest(
      "/withdraw/withdraw-request",
      "POST",
      { amount }
    );
    return response.data;
  } catch (error) {
    console.error("Withdrawal Error:", error);
    throw error;
  }
};

// Deposit API
export const getDepositAddress = async () => {
  try {
    const response = await MakeAuthenticationRequest(
      "/deposit/get-deposit-address"
    );
    return response.data;
  } catch (error) {
    console.error("Deposit Address Error:", error);
    throw error;
  }
};

export const refreshDepositWallet = async () => {
  try {
    const response = await MakeAuthenticationRequest(
      "/deposit/check-deposit-transaction"
    );
    return response.data;
  } catch (error) {
    console.error("Refresh Deposit Error:", error);
    throw error;
  }
};

// Team Business API
export const getTeamBusiness = async () => {
  try {
    const response = await MakeAuthenticationRequest(
      "/referral/get-team-business"
    );
    return response.data;
  } catch (error) {
    console.error("Team Business Error:", error);
    throw error;
  }
};
