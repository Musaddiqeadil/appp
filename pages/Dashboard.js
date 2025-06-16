import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  FontAwesome as Fa,
  FontAwesome5 as Fa5,
  MaterialCommunityIcons as Md,
} from "@expo/vector-icons";
import { getDashboard, getPackages, getTeamBusiness } from "../service/User";
import formatDate from "../utils/formatDate";
import PosterModal from "../components/poster";
import poster from "../assets/images/image.jpeg";
import CustomTable from "../components/CustomeTable";
import Navbar from "../components/Navbar";

const columns = [
  {
    Header: "S.No",
    accessor: "sn",
  },
  {
    Header: "Package Amount",
    accessor: "packageAmount",
  },
  {
    Header: "Start Date",
    accessor: "startDate",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    usdtBalance: 0,
    depositBalance: 0,
    directTeamCount: 0,
    directActiveTeam: 0,
    totalIncomeEarned: 0,
    usdtWithdrawTotal: 0,
    bonuses: {
      directBonus: 0,
      firstDeposit: 0,
      dailyBonus: 0,
      teamCommission: 0,
    },
  });

  const [showModal, setShowModal] = useState(true);
  const [teamBusiness, setTeamBusiness] = useState(null);
  const [teamBizLoading, setTeamBizLoading] = useState(true);

  const formatNumber = (num) => parseFloat(num).toFixed(2);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dash, pkgs] = await Promise.all([getDashboard(), getPackages()]);

        setDashboardData({
          totalInvestment: formatNumber(dash.totalInvestment),
          usdtBalance: formatNumber(dash.usdtBalance),
          depositBalance: formatNumber(dash.depositBalance),
          directTeamCount: dash.directTeamCount,
          directActiveTeam: dash.directActiveTeam,
          totalIncomeEarned: formatNumber(dash.totalIncomeEarned),
          usdtWithdrawTotal: formatNumber(dash.usdtWithdrawTotal),
          bonuses: {
            directBonus: formatNumber(dash.bonuses.directBonus),
            firstDeposit: formatNumber(dash.bonuses.firstDeposit),
            dailyBonus: formatNumber(dash.bonuses.dailyBonus),
            teamCommission: formatNumber(dash.bonuses.teamCommission),
          },
        });

        setPackages(
          pkgs.map((pkg, i) => ({
            sn: i + 1,
            packageAmount: pkg.packageAmount,
            startDate: formatDate(pkg.startDate),
            status: pkg.status,
          }))
        );
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error loading dashboard data",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    let mounted = true;
    getTeamBusiness()
      .then((res) => {
        if (mounted) setTeamBusiness(res.totalBusiness);
      })
      .catch((err) => console.error("Error fetching team business:", err))
      .finally(() => {
        if (mounted) setTeamBizLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderStatItem = (icon, title, value) => (
    <View style={styles.statItem}>
      {icon}
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.safeArea}>
        <Navbar />

        {showModal && (
          <PosterModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            posterSrc={
              Platform.OS === "web"
                ? poster
                : Image.resolveAssetSource(poster).uri
            }
            posterAlt="Announcement"
          />
        )}

        <View style={styles.innerContainer}>
          <Text style={styles.mainHeading}>Dashboard</Text>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa name="dollar" size={24} color="#4CAF50" />,
              "Total Investment",
              `$${dashboardData.totalInvestment}`
            )}
            {renderStatItem(
              <Fa name="dollar" size={24} color="#4CAF50" />,
              "Total Team Business",
              teamBizLoading ? "---" : `$${formatNumber(teamBusiness || 0)}`
            )}
          </View>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa5 name="users" size={24} color="#2196F3" />,
              "Direct Team",
              dashboardData.directTeamCount
            )}
            {renderStatItem(
              <Fa5 name="users" size={24} color="#2196F3" />,
              "Active Direct Team",
              dashboardData.directActiveTeam
            )}
          </View>

          <Text style={styles.mainHeading}>Wallet and Earnings</Text>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa name="money" size={24} color="#FF9800" />,
              "USDT Wallet",
              `$${dashboardData.usdtBalance}`
            )}
            {renderStatItem(
              <Fa name="money" size={24} color="#FF9800" />,
              "Deposit Wallet",
              `$${dashboardData.depositBalance}`
            )}
          </View>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa5 name="rocket" size={24} color="#E91E63" />,
              "Total Bonus Earned",
              `$${dashboardData.totalIncomeEarned}`
            )}
            {renderStatItem(
              <Fa name="dollar" size={24} color="#4CAF50" />,
              "Total USDT Withdrawn",
              `$${dashboardData.usdtWithdrawTotal}`
            )}
          </View>

          <Text style={styles.mainHeading}>Income Breakdown</Text>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa name="dollar" size={24} color="#4CAF50" />,
              "Direct Bonus",
              `$${dashboardData.bonuses.directBonus}`
            )}
            {renderStatItem(
              <Fa name="gift" size={24} color="#9C27B0" />,
              "First Deposit Bonus",
              `$${dashboardData.bonuses.firstDeposit}`
            )}
          </View>

          <View style={styles.statsRow}>
            {renderStatItem(
              <Fa name="calendar" size={24} color="#3F51B5" />,
              "Daily Income",
              `$${dashboardData.bonuses.dailyBonus}`
            )}
            {renderStatItem(
              <Fa5 name="users" size={24} color="#2196F3" />,
              "Team Commission",
              `$${dashboardData.bonuses.teamCommission}`
            )}
          </View>

          <Text style={styles.mainHeading}>Announcement</Text>
          <View style={styles.announcementContainer}>
            <Text style={styles.announcementText}>
              TNT Tierion - Secure your Future with AI powered trading and on
              Education.
            </Text>
          </View>

          <View style={styles.tableContainer}>
            <CustomTable
              columns={columns}
              data={packages}
              heading="My Packages"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f5f5f5", // match your background color
  },

  mainHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  announcementContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // This is for Android
  },
  announcementText: {
    fontSize: 16,
    color: "#333",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden", // This ensures the shadow works properly with rounded corners
  },
});

export default Dashboard;
