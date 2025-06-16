import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { getReferrerName, register } from "../service/Auth";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    referralId: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [currentReferralName, setCurrentReferralName] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState("register");

  const navigation = useNavigation();
  const route = useRoute();
  const token = ""; // You'll need to implement your token storage solution

  // Extract the referral ID from the route params
  useEffect(() => {
    if (route.params?.referralId) {
      setFormData((prev) => ({
        ...prev,
        referralId: route.params.referralId,
      }));
      fetchReferralName(route.params.referralId);
    }
  }, [route.params]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "referralId" && value.length >= 7) {
      fetchReferralName(value);
    }

    if (name === "referralId" && value.length < 7) {
      setCurrentReferralName("");
    }
  };

  const fetchReferralName = async (refId) => {
    try {
      const name = await getReferrerName(refId.toUpperCase(), token);
      if (name) {
        setCurrentReferralName(name);
        Toast.show({
          type: "success",
          text1: "Referral verified",
        });
      } else {
        setCurrentReferralName("");
      }
    } catch {
      setCurrentReferralName("");
    }
  };

  const handleRegister = async () => {
    const { fullName, email, referralId, phone, password, confirmPassword } =
      formData;

    if (
      !fullName ||
      !email ||
      !referralId ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
      });
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Phone number must be exactly 10 digits!",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters long!",
      });
      return;
    }

    if (!currentReferralName) {
      Toast.show({
        type: "error",
        text1: "Referral ID is invalid or empty!",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match!",
      });
      return;
    }

    const registerPayload = {
      fullname: fullName.toUpperCase(),
      phone,
      email,
      referrer: referralId.toUpperCase(),
      password,
    };

    try {
      const result = await register(registerPayload);
      Toast.show({
        type: "success",
        text1: result.message || "Registration successful!",
      });
      setUserId(result?.data?.userId || "");
      setStep("done");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.message,
      });
    }
  };

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
          <Image
            source={require("../assets/images/logo-main.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.loginContainer}>
          {step === "register" && (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Register</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkText}>Already have an account?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Referral Id</Text>
                <TextInput
                  style={styles.input}
                  placeholder="TNT00012"
                  value={formData.referralId}
                  onChangeText={(text) => handleInputChange("referralId", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Referral Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                  placeholder="Referral will auto-populate"
                  value={currentReferralName}
                  editable={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter Password"
                    secureTextEntry={!visible}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setVisible((prev) => !prev)}
                  >
                    <Ionicons
                      name={visible ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm Password"
                    secureTextEntry={!confirmVisible}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      handleInputChange("confirmPassword", text)
                    }
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setConfirmVisible((prev) => !prev)}
                  >
                    <Ionicons
                      name={confirmVisible ? "eye" : "eye-off"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  (!formData.fullName ||
                    !formData.email ||
                    !formData.referralId ||
                    !formData.phone ||
                    !formData.password ||
                    !formData.confirmPassword) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={
                  !formData.fullName ||
                  !formData.email ||
                  !formData.referralId ||
                  !formData.phone ||
                  !formData.password ||
                  !formData.confirmPassword
                }
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}

          {step === "done" && userId && (
            <>
              <Text style={styles.successHeader}>
                🎉 Welcome to TNT Tierion!
              </Text>
              <View style={styles.successInfo}>
                <Text style={styles.successText}>
                  <Text style={styles.boldText}>Name:</Text> {formData.fullName}
                </Text>
                <Text style={styles.successText}>
                  <Text style={styles.boldText}>User ID:</Text> {userId}
                </Text>
                <Text style={styles.successText}>
                  <Text style={styles.boldText}>Password:</Text>{" "}
                  {formData.password}
                </Text>
              </View>
              <Text style={styles.thankYouText}>
                Thank you for registering with us!
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>Go to Login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <Toast />
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
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
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
  successHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  successInfo: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  successText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  thankYouText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
});

export default Register;
