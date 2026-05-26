import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { CustomerDashboard } from "./components/customer/CustomerDashboard";
import { CustomerPoints } from "./components/customer/CustomerPoints";
import { CustomerRedeem } from "./components/customer/CustomerRedeem";
import { CustomerPurchases } from "./components/customer/CustomerPurchases";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminCustomers } from "./components/admin/AdminCustomers";
import { AdminStatistics } from "./components/admin/AdminStatistics";
import { AdminRewards } from "./components/admin/AdminRewards";
import { AdminRules } from "./components/admin/AdminRules";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Home } from "./components/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      {
        path: "customer",
        children: [
          { index: true, Component: CustomerDashboard },
          { path: "points", Component: CustomerPoints },
          { path: "redeem", Component: CustomerRedeem },
          { path: "purchases", Component: CustomerPurchases },
        ],
      },
      {
        path: "admin",
        children: [
          { index: true, Component: AdminDashboard },
          { path: "customers", Component: AdminCustomers },
          { path: "statistics", Component: AdminStatistics },
          { path: "rewards", Component: AdminRewards },
          { path: "rules", Component: AdminRules },
        ],
      },
    ],
  },
]);
