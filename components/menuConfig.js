import {
  FontAwesome as Fa,
  FontAwesome5 as Fa5,
  Feather as Fi,
} from "@expo/vector-icons";

export const menuItems = [
  {
    label: "Dashboard",
    icon: <Fi name="home" size={18} />,
    path: "Dashboard", // React Native uses route names instead of paths
  },
  {
    label: "Profile",
    icon: <Fi name="user" size={18} />,
    path: "Profile",
  },
  {
    label: "Team",
    icon: <Fi name="users" size={18} />,
    path: "Team",
  },
  {
    label: "Income",
    icon: <Fa name="dollar-sign" size={18} />,
    path: "Income",
    dropdown: [
      {
        label: "Direct Bonus",
        path: "DirectBonus",
        icon: <Fi name="user-check" size={18} />,
      },
      {
        label: "Daily Income",
        path: "DailyIncome",
        icon: <Fi name="shield" size={18} />,
      },
      {
        label: "Team Commission",
        path: "TeamCommission",
        icon: <Fi name="users" size={18} />,
      },
    ],
  },
  {
    label: "Wallet",
    icon: <Fa name="wallet" size={18} />,
    path: "Wallet",
    dropdown: [
      {
        label: "USDT Wallet",
        path: "USDTWallet",
        icon: <Fa name="dollar-sign" size={18} />,
      },
      {
        label: "USDT Withdraw",
        path: "USDTWithdraw",
        icon: <Fa name="dollar-sign" size={18} />,
      },
    ],
  },
  {
    label: "Deposit",
    icon: <Fa name="wallet" size={18} />,
    path: "Deposit",
    dropdown: [
      {
        label: "USDT Deposit",
        path: "USDTDeposit",
        icon: <Fa name="dollar-sign" size={18} />,
      },
      {
        label: "Buy Package",
        path: "BuyPackage",
        icon: <Fa name="dollar-sign" size={18} />,
      },
    ],
  },
  {
    label: "Logout",
    icon: <Fi name="log-out" size={18} />,
    path: "Login",
  },
];
