import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useLanguageStore } from "../store/languageStore";

const Ico = ({ d, size = 20, stroke = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth={stroke ? 1.8 : 0}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const HIcon = {
  Menu: () => <Ico d="M4 6h16M4 12h16M4 18h16" />,
  Bell: () => (
    <Ico
      d={[
        "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9",
        "M13.73 21a2 2 0 01-3.46 0",
      ]}
    />
  ),
  Globe: () => (
    <Ico
      d={[
        "M12 2a10 10 0 100 20 10 10 0 000-20z",
        "M2 12h20",
        "M12 2c2.5 2.7 4 6.1 4 10s-1.5 7.3-4 10",
        "M12 2c-2.5 2.7-4 6.1-4 10s1.5 7.3 4 10",
      ]}
    />
  ),
  User: () => (
    <Ico
      d={[
        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
        "M12 3a4 4 0 100 8 4 4 0 000-8z",
      ]}
    />
  ),
  Settings: () => (
    <Ico
      d={[
        "M12 15a3 3 0 100-6 3 3 0 000 6z",
        "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33",
        "M14 3.17V3a2 2 0 00-4 0v.17",
      ]}
    />
  ),
  Logout: () => (
    <Ico
      d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"]}
    />
  ),
  Sun: () => (
    <Ico
      d={[
        "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2",
        "M12 17a5 5 0 100-10 5 5 0 000 10z",
      ]}
    />
  ),
  Moon: () => <Ico d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  Sale: () => (
    <Ico
      d={[
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
        "M3 6h18",
        "M16 10a4 4 0 01-8 0",
      ]}
    />
  ),
  Purchase: () => (
    <Ico d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
  ),
  ChevDown: () => <Ico d="M19 9l-7 7-7-7" size={16} />,
  Store: () => <Ico d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  Report: () => (
    <Ico d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  ),
};

const money = (v) => `৳ ${Number(v || 0).toLocaleString()}`;

const Header = ({ onToggleSidebar, currentPage, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { summary, fetchDashboardSummary } = useDashboardStore();
  const { lang, setLang, t } = useLanguageStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const displayName = user?.full_name || user?.username || "User";
  const displayEmail = user?.email || "no-email@example.com";
  const displayRole = user?.role?.role_name || t("noRole");
  const displayStore = user?.store?.store_name || t("noStore");
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "U";

  const formattedRole =
    displayRole.charAt(0).toUpperCase() + displayRole.slice(1);

  const roleBadgeColor =
    displayRole === "admin"
      ? "#ef4444"
      : displayRole === "manager"
        ? "#3b82f6"
        : "#22c55e";

  const bg = darkMode ? "#040d1c" : "#ffffff";
  const subBg = darkMode ? "#060f22" : "#f7fcf9";
  const borderClr = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(22,120,80,0.12)";
  const textPrimary = darkMode ? "#f0faff" : "#0a1f14";
  const textSec = darkMode ? "#a8d4c2" : "#3d7a5a";
  const textMuted = darkMode ? "#5a8a72" : "#6aaa88";
  const accent = "#ac5208";
  const green = darkMode ? "#22c55e" : "#16a34a";
  const cardBg = darkMode ? "#0a1628" : "#ffffff";
  const cardBorder = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(22,120,80,0.12)";
  const font = "'Open Sans', sans-serif";

  const STATS = [
    {
      label: t("totalSales"),
      value: money(summary?.revenue),
      up: true,
      delta: `${summary?.sales_count || 0} ${t("sales")}`,
    },
    {
      label: t("purchases"),
      value: money(summary?.purchases_total),
      up: false,
      delta: t("cost"),
    },
    {
      label: t("dueAmount"),
      value: money(summary?.due_revenue),
      up: false,
      delta: t("pending"),
    },
    {
      label: t("lowStockItems"),
      value: `${summary?.low_stock_alerts || 0} ${lang === "bn" ? "আইটেম" : "Items"}`,
      up: false,
      delta: t("alert"),
    },
  ];

  const notifications = [
    {
      id: 1,
      text:
        lang === "bn"
          ? `লো স্টক আইটেম: ${summary?.low_stock_alerts || 0}`
          : `Low stock items: ${summary?.low_stock_alerts || 0}`,
      time: t("live"),
      color: "#f59e0b",
    },
    {
      id: 2,
      text:
        lang === "bn"
          ? `মোট বিক্রি সংখ্যা: ${summary?.sales_count || 0}`
          : `Sales count: ${summary?.sales_count || 0}`,
      time: t("live"),
      color: "#22c55e",
    },
    {
      id: 3,
      text:
        lang === "bn"
          ? `বাকি টাকা: ${money(summary?.due_revenue)}`
          : `Due revenue: ${money(summary?.due_revenue)}`,
      time: t("live"),
      color: "#ef4444",
    },
  ];

  const btnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 10,
    cursor: "pointer",
    border: `1px solid ${borderClr}`,
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(22,120,80,0.06)",
    color: textSec,
    transition: "all 0.2s",
    position: "relative",
    fontFamily: font,
  };

  const menuItems = [
    { icon: <HIcon.User />, label: t("myProfile") },
    { icon: <HIcon.Store />, label: displayStore },
    { icon: <HIcon.Report />, label: t("reports") },
    { icon: <HIcon.Settings />, label: t("settings") },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ fontFamily: font }}>
      <header
        style={{
          background: bg,
          borderBottom: `1px solid ${borderClr}`,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
          position: "relative",
          zIndex: 20,
        }}
      >
        <button style={btnBase} onClick={onToggleSidebar}>
          <HIcon.Menu />
        </button>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: textMuted,
              fontSize: 11,
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            CraftPOS
          </span>

          <h1
            style={{
              color: textPrimary,
              fontSize: 17,
              fontWeight: 800,
              lineHeight: 1,
              margin: 0,
            }}
          >
            {currentPage}
          </h1>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => navigate("/sales/new")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 14px",
            height: 38,
            borderRadius: 10,
            background: accent,
            border: "none",
            color: "#ffffff",
            fontFamily: font,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(172,82,8,0.28)",
          }}
        >
          <HIcon.Sale /> {t("newSale")}
        </button>

        <button
          onClick={() => navigate("/purchases/new")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 14px",
            height: 38,
            borderRadius: 10,
            background: darkMode
              ? "rgba(34,197,94,0.08)"
              : "rgba(22,163,74,0.1)",
            border: `1px solid ${
              darkMode ? "rgba(34,197,94,0.25)" : "rgba(22,163,74,0.3)"
            }`,
            color: green,
            fontFamily: font,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <HIcon.Purchase /> {t("purchase")}
        </button>

        <div ref={notifRef} style={{ position: "relative" }}>
          <button style={btnBase} onClick={() => setNotifOpen(!notifOpen)}>
            <HIcon.Bell />
            {(summary?.low_stock_alerts || 0) > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 7,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: `1.5px solid ${bg}`,
                }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="animate-slide-up"
              style={{
                position: "absolute",
                right: 0,
                top: 46,
                width: 320,
                background: cardBg,
                borderRadius: 14,
                border: `1px solid ${cardBorder}`,
                boxShadow: darkMode
                  ? "0 20px 60px rgba(0,0,0,0.5)"
                  : "0 20px 60px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "14px 16px 10px",
                  borderBottom: `1px solid ${cardBorder}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ color: textPrimary, fontWeight: 700, fontSize: 14 }}
                >
                  {t("notifications")}
                </span>

                <span style={{ color: green, fontSize: 11, fontWeight: 700 }}>
                  {t("live")}
                </span>
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "11px 16px",
                    borderBottom: `1px solid ${cardBorder}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: n.color,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: textPrimary,
                        fontSize: 12,
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {n.text}
                    </p>

                    <span style={{ color: textMuted, fontSize: 10 }}>
                      {n.time}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <span
                  onClick={() => navigate("/inventory/low-stock")}
                  style={{
                    color: green,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t("viewStockAlerts")}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            height: 38,
            borderRadius: 10,
            border: `1px solid ${borderClr}`,
            background: darkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(22,120,80,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 8px",
            color: textSec,
          }}
        >
          <HIcon.Globe />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: textSec,
              fontFamily: font,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="en">EN</option>
            <option value="bn">BN</option>
          </select>
        </div>

        <button
          style={btnBase}
          onClick={() => setDarkMode && setDarkMode(!darkMode)}
        >
          {darkMode ? <HIcon.Sun /> : <HIcon.Moon />}
        </button>

        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              background: profileOpen
                ? darkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(22,120,80,0.08)"
                : "transparent",
              border: `1px solid ${profileOpen ? borderClr : "transparent"}`,
              borderRadius: 10,
              padding: "5px 10px 5px 5px",
              fontFamily: font,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: `linear-gradient(135deg,${accent},#7a3a06)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(172,82,8,0.35)",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
                {avatarLetter}
              </span>
            </div>

            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  color: textPrimary,
                  fontWeight: 700,
                  fontSize: 12,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </p>

              <p style={{ color: textSec, fontSize: 10, margin: 0 }}>
                {formattedRole}
              </p>
            </div>

            <span style={{ color: textMuted }}>
              <HIcon.ChevDown />
            </span>
          </button>

          {profileOpen && (
            <div
              className="animate-slide-up"
              style={{
                position: "absolute",
                right: 0,
                top: 50,
                width: 250,
                background: cardBg,
                borderRadius: 12,
                border: `1px solid ${cardBorder}`,
                boxShadow: darkMode
                  ? "0 20px 60px rgba(0,0,0,0.5)"
                  : "0 20px 60px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${cardBorder}`,
                }}
              >
                <p
                  style={{
                    color: textPrimary,
                    fontWeight: 700,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  {displayName}
                </p>

                <p
                  style={{
                    color: textSec,
                    fontSize: 11,
                    margin: "4px 0 0",
                    wordBreak: "break-word",
                  }}
                >
                  {displayEmail}
                </p>

                <p
                  style={{
                    color: textMuted,
                    fontSize: 11,
                    margin: "4px 0 0",
                    wordBreak: "break-word",
                  }}
                >
                  {displayStore}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    background: `${roleBadgeColor}20`,
                    color: roleBadgeColor,
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 20,
                    border: `1px solid ${roleBadgeColor}50`,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {displayRole}
                </span>
              </div>

              {menuItems.map((m, i) => (
                <button
                  key={i}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: textSec,
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: "left",
                    fontFamily: font,
                  }}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}

              <div
                style={{
                  borderTop: `1px solid ${cardBorder}`,
                  margin: "4px 0",
                }}
              />

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "left",
                  fontFamily: font,
                }}
              >
                <HIcon.Logout />
                <span>{t("signOut")}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div
        style={{
          background: subBg,
          borderBottom: `1px solid ${borderClr}`,
          padding: "0 20px",
          display: "flex",
          overflowX: "auto",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 24px 8px 0",
              marginRight: 24,
              borderRight:
                i < STATS.length - 1 ? `1px solid ${borderClr}` : "none",
              flexShrink: 0,
            }}
          >
            <div>
              <p
                style={{
                  color: textMuted,
                  fontSize: 10,
                  margin: 0,
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                {s.label.toUpperCase()}
              </p>

              <p
                style={{
                  color: textPrimary,
                  fontSize: 15,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                {s.value}
              </p>
            </div>

            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 7px",
                borderRadius: 20,
                background: s.up
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(239,68,68,0.1)",
                color: s.up ? green : "#ef4444",
                border: `1px solid ${
                  s.up ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
                }`,
              }}
            >
              {s.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
