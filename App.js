import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Team from "./components/Team";
import DailyIncome from "./components/income/DailyIncome";
import DirectBonus from "./components/income/DirectBonus";
import TeamCommission from "./components/income/TeamCommission";
// Import the new wallet screens
import USDTWallet from "./components/wallet/USDTWallet";
import USDTWithdawal from "./components/wallet/USDTWithdawal";
import BuyPackage from "./components/deposit/BuyPackage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { AppState } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkLoginStatus();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Dashboard" : "Login"}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              title: "My Profile",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="Team"
            component={Team}
            options={{
              headerShown: true,
              title: "My Team",
              headerBackTitle: "Back",
            }}
          />
          {/* Income Screens */}
          <Stack.Screen
            name="DailyIncome"
            component={DailyIncome}
            options={{
              headerShown: true,
              title: "Daily Income",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="DirectBonus"
            component={DirectBonus}
            options={{
              headerShown: true,
              title: "Direct Bonus",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="TeamCommission"
            component={TeamCommission}
            options={{
              headerShown: true,
              title: "Team Commission",
              headerBackTitle: "Back",
            }}
          />
          {/* Wallet Screens */}
          <Stack.Screen
            name="USDTWallet"
            component={USDTWallet}
            options={{
              headerShown: true,
              title: "USDT Wallet",
              headerBackTitle: "Back",
            }}
          />

          <Stack.Screen
            name="USDTWithdraw"
            component={USDTWithdawal}
            options={{
              headerShown: true,
              title: "USDT Withdraw",
              headerBackTitle: "Back",
            }}
          />
          {/* Deposit Screens */}
          <Stack.Screen
            name="BuyPackage"
            component={BuyPackage}
            options={{
              headerShown: true,
              title: "Buy Package",
              headerBackTitle: "Back",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
