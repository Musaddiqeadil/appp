import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import logo from "../assets/images/logo-main.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../service/Auth";

/**
 * submitLogin - reusable login function (modified for React Native)
 */
export async function submitLogin(
  { userId, password },
  { setIsPending, navigation, Toast }
) {
  if (!userId || !password) {
    Toast.show({
      type: "error",
      text1: "Validation Error",
      text2: "All fields are required!",
    });
    return false;
  }

  setIsPending(true);
  try {
    console.log("Submitting login form with:", { userId, password });
    const userData = await login(userId.toUpperCase(), password);

    if (userData) {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("userId", userId.toUpperCase());

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Login successful!",
      });

      navigation.navigate("Dashboard");
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
      return true;
    }
  } catch (error) {
    console.log("Login error:", error.message); // Debug log

    // Explicitly show the error in Toast
    Toast.show({
      type: "error",
      text1: "Login Failed",
      text2: error.message || "Invalid user ID or password",
      visibilityTime: 4000,
      position: "top",
    });
  } finally {
    setIsPending(false);
  }

  return false;
}

function Login() {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    submitLogin(formData, { setIsPending, navigation, Toast });
  };

  // Handle deep linking for auto-login
  useEffect(() => {
    const handleDeepLink = async (event) => {
      if (!event.url) return;

      const url = new URL(event.url);
      const userId = url.searchParams.get("userId");
      const password = url.searchParams.get("password");

      if (userId && password) {
        setFormData({ userId, password });
        await submitLogin(
          { userId, password },
          { setIsPending, navigation, Toast }
        );
      }
    };

    // Get initial URL if app was launched from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Add event listener for deep links while app is running
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      // Remove the event listener
      subscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Don't have an account?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Member Id</Text>
            <TextInput
              style={styles.input}
              placeholder="TNT000123"
              value={formData.userId}
              onChangeText={(text) => handleInputChange("userId", text)}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isPending}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={!visible}
                editable={!isPending}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setVisible((v) => !v)}
                disabled={isPending}
              >
                <Icon
                  name={visible ? "eye" : "eye-slash"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
            disabled={isPending}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isPending && styles.buttonDisabled,
              (!formData.userId || !formData.password) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isPending || !formData.userId || !formData.password}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  loginContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  linkText: {
    color: "#3498db",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#85c1e9",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;
