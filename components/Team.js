import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getReferralList } from "../service/User";
import formatDate from "../utils/formatDate";

const Team = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [depthLimit, setDepthLimit] = useState(1); // default to Direct Team
  const [selectedTeamType, setSelectedTeamType] = useState("direct");

  const fetchTeamReferrals = async (selectedDepthLimit) => {
    setIsLoading(true);
    try {
      const referrals = await getReferralList(selectedDepthLimit);
      if (!referrals || referrals.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      const updatedList = referrals.map((member, i) => ({
        sn: i + 1,
        memberId: member.userId || "none",
        name: member.name || "none",
        referrer: member.referrer || "none",
        registrationDate: formatDate(member.registrationDate) || "none",
        investmentAmount: member.investmentAmount || 0,
        level: member.level,
      }));

      setData(updatedList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching team referrals:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamReferrals(depthLimit);
  }, [depthLimit]);

  const handleTeamTypeChange = (type) => {
    setSelectedTeamType(type);
    if (type === "direct") {
      setDepthLimit(1);
    } else if (type === "full") {
      setDepthLimit(3);
    }
  };

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
        <Text style={styles.heading}>Team</Text>
      </View>

      {/* Team Type Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Select Team Type:</Text>
        <View style={styles.selectorButtons}>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedTeamType === "direct" && styles.selectedButton,
            ]}
            onPress={() => handleTeamTypeChange("direct")}
          >
            <Text
              style={[
                styles.selectorButtonText,
                selectedTeamType === "direct" && styles.selectedButtonText,
              ]}
            >
              Direct Team (Level 1)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedTeamType === "full" && styles.selectedButton,
            ]}
            onPress={() => handleTeamTypeChange("full")}
          >
            <Text
              style={[
                styles.selectorButtonText,
                selectedTeamType === "full" && styles.selectedButtonText,
              ]}
            >
              Full Team (Up to Level 3)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Team Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.snColumn]}>S.no</Text>
          <Text style={[styles.headerText, styles.memberIdColumn]}>
            Member ID
          </Text>
          <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
          <Text style={[styles.headerText, styles.referrerColumn]}>
            Referrer
          </Text>
          <Text style={[styles.headerText, styles.dateColumn]}>Reg. Date</Text>
          <Text style={[styles.headerText, styles.amountColumn]}>
            Amount (USDT)
          </Text>
          <Text style={[styles.headerText, styles.levelColumn]}>Level</Text>
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
              <Text style={[styles.cellText, styles.memberIdColumn]}>
                {item.memberId}
              </Text>
              <Text style={[styles.cellText, styles.nameColumn]}>
                {item.name}
              </Text>
              <Text style={[styles.cellText, styles.referrerColumn]}>
                {item.referrer}
              </Text>
              <Text style={[styles.cellText, styles.dateColumn]}>
                {item.registrationDate}
              </Text>
              <Text style={[styles.cellText, styles.amountColumn]}>
                {item.investmentAmount}
              </Text>
              <Text style={[styles.cellText, styles.levelColumn]}>
                {item.level}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No team members found</Text>
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
    textAlign: "center",
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  selectorButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectorButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007bff",
  },
  selectorButtonText: {
    color: "#333",
  },
  selectedButtonText: {
    color: "#fff",
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
    color: "#333",
    fontSize: 12,
  },
  cellText: {
    textAlign: "center",
    color: "#333",
    fontSize: 12,
  },
  snColumn: {
    width: "8%",
    paddingHorizontal: 2,
  },
  memberIdColumn: {
    width: "15%",
    paddingHorizontal: 2,
  },
  nameColumn: {
    width: "15%",
    paddingHorizontal: 2,
  },
  referrerColumn: {
    width: "15%",
    paddingHorizontal: 2,
  },
  dateColumn: {
    width: "15%",
    paddingHorizontal: 2,
  },
  amountColumn: {
    width: "15%",
    paddingHorizontal: 2,
  },
  levelColumn: {
    width: "10%",
    paddingHorizontal: 2,
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

export default Team;
