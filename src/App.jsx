import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NewSalePage from "./pages/sale/NewSalePage";
import SaleHistoryPage from "./pages/sale/SaleHistoryPage";
import SaleReturnsPage from "./pages/sale/SaleReturnsPage";
import InstallmentsPage from "./pages/sale/InstallmentsPage";
import NewPurchase from "./pages/puchase/NewPurchase";
import PurchaseHistory from "./pages/puchase/PurchaseHistory";
import PurchaseReturn from "./pages/puchase/PurchaseReturn";
import AllExpenses from "./pages/expense/AllExpenses";
import AddExpense from "./pages/expense/AddExpense";
import ReportsOverview from "./pages/report/ReportsOverview";
import NotFoundPage from "./components/NotFoundPage";
import StockOverview from "./pages/inventory/Stockoverview";
import StockAlert from "./pages/inventory/Stockalert";
import DamageStock from "./pages/inventory/Damagestock";
import StockTransfer from "./pages/inventory/Stocktransfer";
import Products from "./pages/product/Products";
import AddProduct from "./pages/product/Addproduct";
import Categories from "./pages/product/Categories";
import AllCustomers from "./pages/customer/Allcustomers";
import AddCustomer from "./pages/customer/Addcustomer";
import AllSuppliers from "./pages/supplier/Allsuppliers";
import AddSupplier from "./pages/supplier/Addsupplier";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import AuthLayout from "./components/auth/AuthLayout";
import AuthGuard from "./components/auth/AuthGuard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EditProduct from "./pages/product/EditProduct";
import AllBranches from "./pages/branch/AllBranches";
import AllUser from "./pages/user/AllUser";
import AddUser from "./pages/user/AddUser";
import Role from "./pages/user/Role";
import AddStore from "./pages/branch/AddStore";
import SalesReport from "./pages/report/SalesReport";
import PurchaseReport from "./pages/report/PurchaseReport";
import InventoryReport from "./pages/report/InventoryReport";
import ExpenseReport from "./pages/report/ExpenseReport";
function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        <Route element={<AuthGuard />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sales/new" element={<NewSalePage />} />
            <Route path="/sales/history" element={<SaleHistoryPage />} />
            <Route path="/sales/returns" element={<SaleReturnsPage />} />
            <Route path="/sales/installments" element={<InstallmentsPage />} />
            <Route path="/purchases/new" element={<NewPurchase />} />
            <Route path="/purchases/history" element={<PurchaseHistory />} />
            <Route path="/purchases/returns" element={<PurchaseReturn />} />
            <Route path="/inventory/overview" element={<StockOverview />} />
            <Route path="/inventory/low-stock" element={<StockAlert />} />
            <Route path="/inventory/transfer" element={<StockTransfer />} />
            <Route path="/inventory/damage" element={<DamageStock />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/categories" element={<Categories />} />
            <Route path="/customers" element={<AllCustomers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/suppliers" element={<AllSuppliers />} />
            <Route path="/suppliers/add" element={<AddSupplier />} />
            <Route path="/expenses" element={<AllExpenses />} />
            <Route path="/expenses/add" element={<AddExpense />} />
            <Route path="/reports" element={<ReportsOverview />} />
            <Route path="/reports/sales" element={<SalesReport />} />
            <Route path="/reports/purchase" element={<PurchaseReport />} />
            <Route path="/reports/inventory" element={<InventoryReport />} />
            <Route path="/reports/expenses" element={<ExpenseReport />} />
            <Route path="/stores" element={<AllBranches />} />
            <Route path="/stores/add" element={<AddStore />} />
            <Route path="/users" element={<AllUser />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/roles" element={<Role />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
