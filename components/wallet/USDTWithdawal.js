import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { showMessage } from "react-native-flash-message";
import {
  getTransactions,
  getWallet,
  withdrawUSDT,
  getUserProfile,
} from "../../service/User";
import { useNavigation } from "@react-navigation/native";

const USDTWithdraw = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [history, setHistory] = useState([]);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestRequest, setLatestRequest] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Profile & balance
      const profileRes = await getUserProfile();
      setWithdrawAddress(profileRes.data.withdrawAddress || "");
      const wallet = await getWallet();
      setBalance(wallet.USDTBalance || 0);

      // 2. Transactions (newest first)
      const txs = await getTransactions("USDT Withdraw", "USDTWallet", "");
      if (txs.length > 0) {
        setLatestRequest({
          date: txs[0].createdAt,
          status: txs[0].status,
        });
      }

      // 3. Build table data
      const formatted = txs.map((tx, i) => ({
        sn: i + 1,
        amount: tx.debitedAmount || 0,
        date: formatDate(tx.createdAt),
        transactionRemark: tx.transactionRemark || "-",
        status: tx.status,
        toAddress: tx.toAddress,
        txHash: tx.txHash,
      }));
      setHistory(formatted);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleWithdraw = async () => {
    if (!withdrawAddress) {
      return showMessage({
        message: "Please update your withdrawal address in your profile",
        type: "warning",
      });
    }
    if (!withdrawAmt || isNaN(withdrawAmt) || withdrawAmt <= 0) {
      return showMessage({
        message: "Enter a valid amount",
        type: "warning",
      });
    }
    if (withdrawAmt < 10) {
      return showMessage({
        message: "Minimum withdrawal amount is 10 USDT",
        type: "danger",
      });
    }
    if (withdrawAmt > 1000) {
      return showMessage({
        message: "Maximum withdrawal amount is 1000 USDT",
        type: "warning",
      });
    }
    if (withdrawAmt > balance) {
      return showMessage({
        message: "Amount exceeds balance",
        type: "warning",
      });
    }

    setIsSubmitting(true);
    try {
      await withdrawUSDT({ amount: parseFloat(withdrawAmt) });
      showMessage({
        message: "Withdrawal request submitted",
        type: "success",
      });
      setWithdrawAmt("");
      await loadData();
    } catch (err) {
      console.error(err);
      showMessage({
        message: err.response?.data?.message || "Withdrawal failed",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSince = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const hrs = Math.floor(diffMs / 3_600_000);
    const mins = Math.floor((diffMs % 3_600_000) / 60_000);
    return `${hrs}h ${mins}m ago`;
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

      <Text style={styles.mainHeading}>USDT Withdraw</Text>

      {/* Withdraw Form */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Withdraw Funds</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Withdraw Address{" "}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("Profile")}
            >
              Update Address?
            </Text>
          </Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={withdrawAddress}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Available Balance</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={`${balance.toFixed(2)} USDT`}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Withdraw Amount</Text>
          <TextInput
            style={styles.input}
            value={withdrawAmt}
            onChangeText={setWithdrawAmt}
            placeholder="Enter USDT to withdraw"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleWithdraw}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes Box */}
      <View style={styles.notesBox}>
        <Text style={styles.noteText}>
          • Minimum withdrawal should be 10 USDT.
        </Text>
        <Text style={styles.noteText}>
          • Withdrawal will be processed within 24 to 96 hours.
        </Text>
      </View>

      {/* Latest Request Box */}
      {latestRequest && (
        <View style={styles.latestBox}>
          {latestRequest.status === "Pending" ? (
            <Text style={styles.latestText}>
              Time since last request:{" "}
              <Text style={styles.boldText}>
                {timeSince(latestRequest.date)}
              </Text>
            </Text>
          ) : (
            <Text style={styles.latestText}>
              Last withdrawal request placed on:{" "}
              <Text style={styles.boldText}>
                {new Date(latestRequest.date).toLocaleString()}
              </Text>
            </Text>
          )}
        </View>
      )}

      {/* Withdrawal History */}
      <Text style={styles.tableHeader}>Withdrawal History</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>S.No</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>

        {history.map((row) => (
          <DataTable.Row key={row.sn}>
            <DataTable.Cell>{row.sn}</DataTable.Cell>
            <DataTable.Cell>{row.amount}</DataTable.Cell>
            <DataTable.Cell>{row.date}</DataTable.Cell>
            <DataTable.Cell>
              <Text
                style={{
                  color:
                    row.status === "Completed"
                      ? "green"
                      : row.status === "Pending"
                      ? "orange"
                      : "red",
                }}
              >
                {row.status}
              </Text>
            </DataTable.Cell>
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
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  notesBox: {
    backgroundColor: "#fff8e1",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  noteText: {
    marginBottom: 8,
    fontSize: 14,
  },
  latestBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  latestText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default USDTWithdraw;
