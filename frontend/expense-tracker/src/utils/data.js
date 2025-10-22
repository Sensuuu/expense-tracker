import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuBot,
  LuUser,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Profile",
    icon: LuUser, // Import from react-icons/lu if not already
    path: "/profile",
  },
  {
    id: "02",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "03",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "04",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "05",
    label: "AI Assistant",
    icon: LuBot,
    path: "/ai-chat",
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];
