import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getTransactions } from "../../service/User"; // Assuming getTransactions is already available
import formatDate from "../../utils/formatDate"; // Helper to format dates (if needed)

const DailyIncome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const transactions = await getTransactions("Daily Bonus", "credited");

      if (!transactions || transactions.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      const updatedList = transactions.map((transaction, i) => ({
        sn: i + 1,
        transactionRemark: transaction.transactionRemark || "none",
        type: "Daily Income",
        amount: transaction.creditedAmount || 0,
        date: formatDate(transaction.createdAt) || "none",
      }));

      setData(updatedList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Daily Income</Text>
      </View>

      {/* Transactions Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.snColumn]}>S.no</Text>
          <Text style={[styles.headerText, styles.amountColumn]}>
            Amount (USDT)
          </Text>
          <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
          <Text style={[styles.headerText, styles.typeColumn]}>Type</Text>
          <Text style={[styles.headerText, styles.remarkColumn]}>
            Transaction Remark
          </Text>
        </View>

        {/* Table Rows */}
        {data.length > 0 ? (
          data.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <Text style={[styles.cellText, styles.snColumn]}>{item.sn}</Text>
              <Text style={[styles.cellText, styles.amountColumn]}>
                {item.amount}
              </Text>
              <Text style={[styles.cellText, styles.dateColumn]}>
                {item.date}
              </Text>
              <Text style={[styles.cellText, styles.typeColumn]}>
                {item.type}
              </Text>
              <Text style={[styles.cellText, styles.remarkColumn]}>
                {item.transactionRemark}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No transactions found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  cellText: {
    textAlign: "center",
    color: "#333",
  },
  snColumn: {
    width: "10%",
  },
  amountColumn: {
    width: "20%",
  },
  dateColumn: {
    width: "20%",
  },
  typeColumn: {
    width: "20%",
  },
  remarkColumn: {
    width: "30%",
  },
  noData: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
  },
});

export default DailyIncome;
