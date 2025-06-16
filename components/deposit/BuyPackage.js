import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { showMessage } from "react-native-flash-message";
import { DataTable } from "react-native-paper";
import { getWallet, getPackages, createPackage } from "../../service/User";
import formatDate from "../../utils/formatDate";

const packageOptions = [100, 500, 1000, 3000, 5000, 10000];

const BuyPackage = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch deposit balance from wallet
      const wallet = await getWallet();
      setBalance(wallet.depositBalance || 0);

      // Fetch existing packages
      const packagesData = await getPackages();
      const formattedPackages = packagesData.map((pkg, i) => ({
        sn: i + 1,
        packageAmount: pkg.packageAmount || 0,
        startDate: formatDate(pkg.startDate) || "N/A",
        status: pkg.status || "N/A",
      }));
      setPackages(formattedPackages);
    } catch (err) {
      console.error(err);
      showMessage({
        message: "Failed to load data",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      return showMessage({
        message: "Please select a package amount",
        type: "warning",
      });
    }
    if (selectedPackage > balance) {
      return showMessage({
        message: "Selected package amount exceeds your deposit balance",
        type: "warning",
      });
    }

    setIsSubmitting(true);
    try {
      await createPackage(selectedPackage);
      showMessage({
        message: "Package purchase request submitted",
        type: "success",
      });
      setSelectedPackage("");
      await loadData();
    } catch (err) {
      console.error(err);
      showMessage({
        message: err.response?.data?.message || "Package purchase failed",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isSubmitting && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <Text style={styles.mainHeading}>Buy Package</Text>
      <Text style={styles.balanceText}>
        Your Deposit Balance: {balance.toFixed(2)} USDT
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Select Package Amount</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPackage}
              onValueChange={(itemValue) => setSelectedPackage(itemValue)}
              style={styles.picker}
              mode="dropdown" // Optional: adds dropdown style on Android
            >
              <Picker.Item label="-- Select Package --" value="" />
              {packageOptions.map((amt) => (
                <Picker.Item key={amt} label={`${amt} USDT`} value={amt} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePurchase}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Processing..." : "Buy Package"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableHeader}>My Packages</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>S.No</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
          <DataTable.Title>Start Date</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>

        {packages.map((row) => (
          <DataTable.Row key={row.sn}>
            <DataTable.Cell>{row.sn}</DataTable.Cell>
            <DataTable.Cell>{row.packageAmount}</DataTable.Cell>
            <DataTable.Cell>{row.startDate}</DataTable.Cell>
            <DataTable.Cell>{row.status}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  balanceText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default BuyPackage;
