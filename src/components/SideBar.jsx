import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";

// ── SVG Icon helper ─────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = false, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth={stroke ? 1.8 : 0}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const Icons = {
  Dashboard: () => (
    <Icon
      stroke
      size={20}
      d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]}
    />
  ),
  Sale: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
        "M3 6h18",
        "M16 10a4 4 0 01-8 0",
      ]}
    />
  ),
  Purchase: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
        "M3.27 6.96L12 12.01l8.73-5.05",
        "M12 22.08V12",
      ]}
    />
  ),
  Inventory: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
      ]}
    />
  ),
  Customer: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
        "M23 21v-2a4 4 0 00-3-3.87",
        "M9 3a4 4 0 010 8",
        "M16 3.13a4 4 0 010 7.75",
      ]}
    />
  ),
  Supplier: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z",
        "M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
      ]}
    />
  ),
  Expense: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      ]}
    />
  ),
  Report: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      ]}
    />
  ),
  Users: () => (
    <Icon
      stroke
      size={20}
      d={[
        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
      ]}
    />
  ),
  Store: () => (
    <Icon
      stroke
      size={20}
      d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"]}
    />
  ),
  Product: () => (
    <Icon
      stroke
      size={20}
      d={["M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"]}
    />
  ),
  Chevron: ({ open }) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s",
      }}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Menu: () => <Icon stroke size={22} d="M4 6h16M4 12h16M4 18h16" />,
  Close: () => <Icon stroke size={22} d="M6 18L18 6M6 6l12 12" />,
};

// ── Nav Data ────────────────────────────────────────────────────────
const NAV = [
  { id: 1, label: "Dashboard", icon: <Icons.Dashboard />, path: "/dashboard" },
  {
    id: 2,
    label: "Sales",
    icon: <Icons.Sale />,
    subBar: [
      { id: 21, label: "New Sale", path: "/sales/new", dot: "green" },
      { id: 22, label: "Sale History", path: "/sales/history" },
      { id: 23, label: "Sale Returns", path: "/sales/returns" },
      { id: 24, label: "Installments", path: "/sales/installments" },
    ],
  },
  {
    id: 3,
    label: "Purchases",
    icon: <Icons.Purchase />,
    subBar: [
      { id: 31, label: "New Purchase", path: "/purchases/new", dot: "green" },
      { id: 32, label: "Purchase History", path: "/purchases/history" },
      { id: 33, label: "Purchase Returns", path: "/purchases/returns" },
    ],
  },
  {
    id: 4,
    label: "Inventory",
    icon: <Icons.Inventory />,
    subBar: [
      { id: 41, label: "Stock Overview", path: "/inventory/overview" },
      {
        id: 42,
        label: "Low Stock Alert",
        path: "/inventory/low-stock",
        badge: "!",
      },
      { id: 43, label: "Stock Transfer", path: "/inventory/transfer" },
      { id: 44, label: "Damage Stock", path: "/inventory/damage" },
    ],
  },
  {
    id: 5,
    label: "Products",
    icon: <Icons.Product />,
    subBar: [
      { id: 51, label: "All Products", path: "/products" },
      { id: 52, label: "Add Product", path: "/products/add" },
      { id: 53, label: "Categories", path: "/products/categories" },
    ],
  },
  {
    id: 6,
    label: "Customers",
    icon: <Icons.Customer />,
    subBar: [
      { id: 61, label: "All Customers", path: "/customers" },
      { id: 62, label: "Add Customer", path: "/customers/add" },
    ],
  },
  {
    id: 7,
    label: "Suppliers",
    icon: <Icons.Supplier />,
    subBar: [
      { id: 71, label: "All Suppliers", path: "/suppliers" },
      { id: 72, label: "Add Supplier", path: "/suppliers/add" },
    ],
  },
  {
    id: 8,
    label: "Expenses",
    icon: <Icons.Expense />,
    subBar: [
      { id: 81, label: "All Expenses", path: "/expenses" },
      { id: 82, label: "Add Expense", path: "/expenses/add" },
      { id: 83, label: "Yearly Tracking", path: "/expenses/yearly" },
    ],
  },
  {
    id: 9,
    label: "Reports",
    icon: <Icons.Report />,
    subBar: [
      { id: 91, label: "Sales Report", path: "/reports/sales" },
      { id: 92, label: "Purchase Report", path: "/reports/purchases" },
      { id: 93, label: "Inventory Report", path: "/reports/inventory" },
      { id: 94, label: "Expense Report", path: "/reports/expenses" },
      { id: 95, label: "Profit & Loss", path: "/reports/profit-loss" },
    ],
  },
  {
    id: 10,
    label: "Users",
    icon: <Icons.Users />,
    subBar: [
      { id: 101, label: "All Users", path: "/users" },
      { id: 102, label: "Add User", path: "/users/add" },
      { id: 103, label: "Roles", path: "/users/roles" },
    ],
  },
  {
    id: 11,
    label: "Stores",
    icon: <Icons.Store />,
    subBar: [
      { id: 111, label: "All Stores", path: "/stores" },
      { id: 112, label: "Add Store", path: "/stores/add" },
    ],
  },
];

// ── Sidebar ─────────────────────────────────────────────────────────
const SideBar = ({ isOpen, isMobile, onToggle, darkMode }) => {
  const [openSubmenus, setOpenSubmenus] = useState({ 2: true });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = (id) => setOpenSubmenus((p) => ({ ...p, [id]: !p[id] }));
  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onToggle();
  };
  const isActive = (item) =>
    item.path
      ? location.pathname === item.path
      : item.subBar?.some((s) => location.pathname === s.path);
  const isSubActive = (sub) => location.pathname === sub.path;

  // ── Color tokens (light / dark) ──────────────────────────────────
  const bg = darkMode ? "#040d1c" : "#f0f7f4";
  const bgSecondary = darkMode ? "#060f22" : "#e4f0eb";
  const borderClr = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(22,120,80,0.12)";
  const textPrimary = darkMode ? "#f0faff" : "#0a1f14";
  const textSec = darkMode ? "#a8d4c2" : "#3d7a5a";
  const textMuted = darkMode ? "#4a7a62" : "#6aaa88";
  const accent = "#ac5208";
  const accentHover = "#c96010";
  const green = darkMode ? "#22c55e" : "#16a34a";
  const activeRowBg = darkMode ? "rgba(172,82,8,0.16)" : "rgba(22,163,74,0.12)";
  const activeRowBd = darkMode ? "rgba(172,82,8,0.4)" : "rgba(22,163,74,0.35)";
  const hoverRowBg = darkMode
    ? "rgba(255,255,255,0.04)"
    : "rgba(22,120,80,0.07)";
  const iconActive = darkMode ? "#22c55e" : "#16a34a";
  const iconIdle = darkMode ? "#4a7a62" : "#6aaa88";

  const tooltip = (label) =>
    ReactDOM.createPortal(
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: tooltipPos.y,
          left: tooltipPos.x,
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            background: darkMode ? "#0a1628" : "#fff",
            color: textPrimary,
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            border: `1px solid ${borderClr}`,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          {label}
        </div>
      </div>,
      document.body,
    );

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: bg,
        borderRight: `1px solid ${borderClr}`,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* ── Logo / Toggle ── */}
      <div
        style={{
          padding: isOpen ? "20px 18px 16px" : "20px 0 16px",
          borderBottom: `1px solid ${borderClr}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Logo icon — green accent */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                flexShrink: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M5 12v7h14v-7" />
                <path d="M8 19v-4h8v4" />
                <path d="M3 8l2-4h14l2 4" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  color: textPrimary,
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  lineHeight: 1.1,
                }}
              >
                CraftPOS
              </div>
              <div
                style={{
                  color: textMuted,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                }}
              >
                POS SYSTEM
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            background: darkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(22,120,80,0.08)",
            border: `1px solid ${borderClr}`,
            color: textSec,
            borderRadius: 8,
            padding: 7,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(172,82,8,0.2)";
            e.currentTarget.style.color = accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(22,120,80,0.08)";
            e.currentTarget.style.color = textSec;
          }}
        >
          {isOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>
      </div>

      {/* ── Quick Action Buttons ── */}
      {isOpen && (
        <div style={{ padding: "14px 14px 8px", display: "flex", gap: 8 }}>
          {/* Primary: accent #ac5208 */}
          <button
            onClick={() => handleNav("/sales/new")}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              background: accent,
              border: "none",
              color: "#ffffff",
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              boxShadow: "0 3px 12px rgba(172,82,8,0.45)",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accentHover;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = accent;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Icons.Sale /> New Sale
          </button>
          {/* Secondary: ghost green */}
          <button
            onClick={() => handleNav("/purchases/new")}
            style={{
              flex: 1,
              padding: "9px 8px",
              borderRadius: 9,
              background: darkMode
                ? "rgba(34,197,94,0.08)"
                : "rgba(22,163,74,0.1)",
              border: `1px solid ${darkMode ? "rgba(34,197,94,0.25)" : "rgba(22,163,74,0.3)"}`,
              color: green,
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              letterSpacing: "0.03em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode
                ? "rgba(34,197,94,0.16)"
                : "rgba(22,163,74,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode
                ? "rgba(34,197,94,0.08)"
                : "rgba(22,163,74,0.1)";
            }}
          >
            <Icons.Purchase /> Purchase
          </button>
        </div>
      )}

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          scrollbarWidth: "thin",
          scrollbarColor: `${accent}40 transparent`,
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.id}>
                <div
                  onClick={() =>
                    item.subBar ? toggle(item.id) : handleNav(item.path)
                  }
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      setHoveredItem(item.id);
                      const r = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({
                        x: r.right + 10,
                        y: r.top + r.height / 2,
                      });
                    }
                    if (!active) e.currentTarget.style.background = hoverRowBg;
                  }}
                  onMouseLeave={(e) => {
                    setHoveredItem(null);
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isOpen ? "space-between" : "center",
                    padding: isOpen ? "9px 12px" : "10px 0",
                    borderRadius: 10,
                    cursor: "pointer",
                    gap: 10,
                    background: active ? activeRowBg : "transparent",
                    border: `1px solid ${active ? activeRowBd : "transparent"}`,
                    transition: "all 0.18s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        color: active ? iconActive : iconIdle,
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        transition: "color 0.18s",
                      }}
                    >
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span
                        style={{
                          color: active ? textPrimary : textSec,
                          fontWeight: active ? 700 : 500,
                          fontSize: 13,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {item.subBar && isOpen && (
                    <span style={{ color: textMuted, flexShrink: 0 }}>
                      <Icons.Chevron open={openSubmenus[item.id]} />
                    </span>
                  )}
                </div>
                {!isOpen && hoveredItem === item.id && tooltip(item.label)}

                {/* Submenu */}
                {item.subBar && openSubmenus[item.id] && isOpen && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "2px 0 2px 12px",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {item.subBar.map((sub) => {
                      const sa = isSubActive(sub);
                      return (
                        <li key={sub.id}>
                          <div
                            onClick={() => handleNav(sub.path)}
                            onMouseEnter={(e) => {
                              if (!sa)
                                e.currentTarget.style.background = hoverRowBg;
                            }}
                            onMouseLeave={(e) => {
                              if (!sa)
                                e.currentTarget.style.background =
                                  "transparent";
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "7px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              background: sa
                                ? darkMode
                                  ? "rgba(34,197,94,0.1)"
                                  : "rgba(22,163,74,0.1)"
                                : "transparent",
                              borderLeft: `2px solid ${sa ? green : "transparent"}`,
                              transition: "all 0.15s",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: sa
                                  ? green
                                  : darkMode
                                    ? "rgba(255,255,255,0.12)"
                                    : "rgba(22,120,80,0.2)",
                              }}
                            />
                            <span
                              style={{
                                color: sa ? textPrimary : textSec,
                                fontSize: 12,
                                fontWeight: sa ? 600 : 400,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {sub.label}
                            </span>
                            {sub.badge && (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  background: "#ef4444",
                                  color: "#fff",
                                  fontSize: 9,
                                  fontWeight: 800,
                                  borderRadius: 4,
                                  padding: "1px 5px",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {sub.badge}
                              </span>
                            )}
                            {sub.dot === "green" && (
                              <span
                                style={{
                                  marginLeft: "auto",
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: green,
                                  boxShadow: `0 0 6px ${green}`,
                                }}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ── */}
      {isOpen && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${borderClr}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: textMuted,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            v2.1.0 • CraftPOS
          </span>
          <span
            className="live-badge"
            style={{
              background: "rgba(34,197,94,0.12)",
              color: green,
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
              border: "1px solid rgba(34,197,94,0.25)",
              letterSpacing: "0.06em",
            }}
          >
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default SideBar;
