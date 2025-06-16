import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { DataTable } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { showMessage } from "react-native-flash-message";
import { getTransactions, getWallet } from "../../service/User";

const USDTWallet = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      // Fetch wallet balance
      const walletInfo = await getWallet();
      setBalance(walletInfo.USDTBalance || 0);

      // Fetch USDT transactions
      const transactions = await getTransactions("", "", "USDTBalance");
      const formatted = transactions.map((tx, idx) => {
        const credit = tx.creditedAmount || 0;
        const debit = tx.debitedAmount || 0;
        return {
          sn: idx + 1,
          amount: credit > 0 ? credit : -debit,
          isCredit: credit > 0,
          date: formatDate(tx.createdAt),
          type: credit > 0 ? "Credit" : "Debit",
          transactionRemark: tx.transactionRemark || "-",
        };
      });
      setData(formatted);
    } catch (err) {
      console.error("Error loading USDT wallet data:", err);
      showMessage({
        message: "Failed to load USDT wallet data",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    // Implement your date formatting logic here
    // This is a simple example:
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Icon name="money" size={30} color="#4CAF50" />
        <Text style={styles.balanceTitle}>USDT Wallet Balance</Text>
        <Text style={styles.balanceAmount}>{balance.toFixed(2)} USDT</Text>
      </View>

      <Text style={styles.transactionHeader}>USDT Transactions</Text>

      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>S.No</DataTable.Title>
          <DataTable.Title>Amount (USDT)</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Remark</DataTable.Title>
        </DataTable.Header>

        {data.map((row) => (
          <DataTable.Row key={row.sn}>
            <DataTable.Cell>{row.sn}</DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ color: row.isCredit ? "green" : "red" }}>
                {row.isCredit ? `+${row.amount}` : `-${row.amount}`}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>{row.date}</DataTable.Cell>
            <DataTable.Cell>{row.transactionRemark}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
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
  balanceCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  transactionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default USDTWallet;
