import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const PATH_TITLES = {
  "/dashboard": "Dashboard",
  "/sales/new": "New Sale",
  "/sales/history": "Sale History",
  "/sales/returns": "Sales Returns",
  "/sales/installments": "Installments",
  "/purchases/new": "New Purchase",
  "/purchases/history": "Purchase History",
  "/purchases/returns": "Purchase Returns",
  "/inventory/overview": "Stock Overview",
  "/inventory/low-stock": "Low Stock Alert",
  "/inventory/transfer": "Stock Transfer",
  "/inventory/damage": "Damage Stock",
  "/products": "All Products",
  "/products/add": "Add Product",
  "/products/categories": "Categories",
  "/customers": "All Customers",
  "/customers/add": "Add Customer",
  "/suppliers": "All Suppliers",
  "/suppliers/add": "Add Supplier",
  "/expenses": "All Expenses",
  "/expenses/add": "Add Expense",
  "/expenses/yearly": "Yearly Tracking",
  "/reports/sales": "Sales Report",
  "/reports/purchases": "Purchase Report",
  "/reports/inventory": "Inventory Report",
  "/reports/expenses": "Expense Report",
  "/reports/profit-loss": "Profit & Loss",
  "/users": "All Users",
  "/users/add": "Add User",
  "/users/roles": "User Roles",
  "/stores": "All Stores",
  "/stores/add": "Add Store",
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const location = useLocation();

  // Apply/remove .dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setCurrentPage(PATH_TITLES[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-base)",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 30 : "auto",
          height: "100%",
          width: isSidebarOpen ? 260 : isMobile ? 0 : 72,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          flexShrink: 0,
          transform:
            isMobile && !isSidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <SideBar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onToggle={toggleSidebar}
          darkMode={darkMode}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4,13,28,0.75)",
            zIndex: 20,
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          currentPage={currentPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
            background: "var(--bg-base)",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--scrollbar) transparent",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
