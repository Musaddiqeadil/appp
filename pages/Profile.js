import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Clipboard,
  Alert,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import { getUserProfile, updateUserProfile } from "../service/User";
import Toast from "react-native-toast-message";
import Loader from "../components/Loader";
import Loader2 from "../components/Loader2";
import Icon from "react-native-vector-icons/Feather";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    selectedFile: null,
    name: "",
    userId: "",
    phone: "",
    email: "",
    walletAddress: "",
    image: "",
  });

  const fetchProfileDetails = async () => {
    setIsLoading(true);
    try {
      const profileDetails = await getUserProfile();
      setProfileData({
        ...profileData,
        userId: profileDetails.data.userId,
        name: profileDetails.data.fullname,
        phone: profileDetails.data.phone || "",
        email: profileDetails.data.email,
        walletAddress: profileDetails.data.withdrawAddress || "",
        // In your getUserProfile function
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleEditClick = () => setIsEdit(true);
  const handleCancelClick = () => {
    setIsEdit(false);
    fetchProfileDetails();
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        fullname: profileData.name,
        withdrawalAddress: profileData.walletAddress,
        phone: profileData.phone,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });
      setIsEdit(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile!",
      });
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const BASE_URL = "https://tnttierion.com.com";
  const referralLink = `${BASE_URL}/dashboard/register?r=${profileData.userId}`;

  const handleOpenReferralLink = () => {
    Linking.openURL(referralLink).catch(() => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to open link",
      });
    });
  };

  const copyToClipboard = () => {
    if (Platform.OS === "web") {
      navigator.clipboard.writeText(referralLink);
    } else {
      Clipboard.setString(referralLink);
    }
    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: "Referral link copied to clipboard",
    });
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.mainHeading}>Referral Link</Text>
            {isSubmitting && <Loader2 />}

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Referral Link</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Referral Link</Text>
                  <View style={styles.referralCopyWrapper}>
                    <TextInput
                      style={[styles.input, styles.referralInput]}
                      value={referralLink}
                      editable={false}
                    />
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={copyToClipboard}
                    >
                      <Icon name="copy" size={18} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.mainHeading}>Profile</Text>
            {isSubmitting && <Loader2 />}

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Profile Info</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>User ID</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profileData.userId}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={[styles.input, !isEdit && styles.disabledInput]}
                    value={profileData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    editable={isEdit}
                    maxLength={20}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={[styles.input, !isEdit && styles.disabledInput]}
                    value={profileData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    editable={isEdit}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profileData.email}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Wallet Address</Text>
                  <TextInput
                    style={[styles.input, !isEdit && styles.disabledInput]}
                    value={profileData.walletAddress}
                    onChangeText={(text) =>
                      handleInputChange("walletAddress", text)
                    }
                    editable={isEdit}
                    placeholder="Paste your wallet address here"
                  />
                </View>

                <View style={styles.buttonGroup}>
                  {isEdit ? (
                    <>
                      <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSaveClick}
                      >
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancelClick}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleEditClick}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 20,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  referralCopyWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  referralInput: {
    flex: 1, // Take up all available space
    marginRight: 10, // Add some spacing between input and button
  },
  copyButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 40, // Match the input field height
    width: 40, // Fixed width for square button
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: "#666",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  referralCopyWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 4,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Profile;
