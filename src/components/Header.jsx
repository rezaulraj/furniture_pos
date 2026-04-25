import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// ── Icon helper ───────────────────────────────────────────────────
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
  Search: () => <Ico d={["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"]} />,
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
        "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
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
        "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
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
    <Ico
      d={[
        "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
      ]}
    />
  ),
  ChevDown: () => <Ico d="M19 9l-7 7-7-7" size={16} />,
  Store: () => <Ico d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"]} />,
  Report: () => (
    <Ico
      d={[
        "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      ]}
    />
  ),
};

// ── Notifications ─────────────────────────────────────────────────
const NOTIFS = [
  {
    id: 1,
    text: "Low stock: Dining Table (3 left)",
    time: "5m ago",
    color: "#f59e0b",
  },
  {
    id: 2,
    text: "New sale #INV-2041 — ৳ 28,500",
    time: "12m ago",
    color: "#22c55e",
  },
  {
    id: 3,
    text: "PO #PO-0892 delivered — 24 items",
    time: "1h ago",
    color: "#3b82f6",
  },
  {
    id: 4,
    text: "Return request #RT-0041 pending",
    time: "2h ago",
    color: "#ef4444",
  },
];

// ── Stats Bar Data ────────────────────────────────────────────────
const STATS = [
  { label: "Today's Sales", value: "৳ 1,24,500", up: true, delta: "+12%" },
  { label: "Purchases", value: "৳ 68,200", up: false, delta: "-3%" },
  { label: "Due Amount", value: "৳ 34,800", up: true, delta: "+5%" },
  { label: "Low Stock Items", value: "7 Items", up: false, delta: "Critical" },
];

const Header = ({ onToggleSidebar, currentPage, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const displayName = user?.full_name || "User";
  const displayEmail = user?.email || "no-email@example.com";
  const displayRole = user?.role?.role_name || "No Role";
  const displayStore = user?.store?.store_name || "No Store";
  const avatarLetter = user?.full_name?.charAt(0)?.toUpperCase() || "U";

  const formattedRole =
    displayRole.charAt(0).toUpperCase() + displayRole.slice(1);

  const roleBadgeColor =
    displayRole === "admin"
      ? "#ef4444"
      : displayRole === "manager"
        ? "#3b82f6"
        : "#22c55e";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // ── Color tokens ──────────────────────────────────────────────
  const bg = darkMode ? "#040d1c" : "#f0f7f4";
  const borderClr = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(22,120,80,0.12)";
  const textPrimary = darkMode ? "#f0faff" : "#0a1f14";
  const textSec = darkMode ? "#a8d4c2" : "#3d7a5a";
  const textMuted = darkMode ? "#4a7a62" : "#6aaa88";
  const accent = "#ac5208";
  const accentHover = "#c96010";
  const green = darkMode ? "#22c55e" : "#16a34a";
  const cardBg = darkMode ? "#0a1628" : "#ffffff";
  const cardBorder = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(22,120,80,0.12)";

  const font = "'Open Sans', sans-serif";

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
    { icon: <HIcon.User />, label: "My Profile" },
    { icon: <HIcon.Store />, label: displayStore },
    { icon: <HIcon.Report />, label: "Reports" },
    { icon: <HIcon.Settings />, label: "Settings" },
  ];

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
        <button
          style={btnBase}
          onClick={onToggleSidebar}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(172,82,8,0.18)";
            e.currentTarget.style.color = accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(22,120,80,0.06)";
            e.currentTarget.style.color = textSec;
          }}
        >
          <HIcon.Menu />
        </button>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                color: textMuted,
                fontSize: 11,
                letterSpacing: "0.08em",
                fontWeight: 500,
              }}
            >
              CraftPOS
            </span>
          </div>
          <h1
            style={{
              color: textPrimary,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.01em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {currentPage}
          </h1>
        </div>

        <div style={{ flex: 1 }} />

        <button
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
            letterSpacing: "0.03em",
            boxShadow: "0 3px 12px rgba(172,82,8,0.4)",
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
          <HIcon.Sale /> New Sale
        </button>

        <button
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
            letterSpacing: "0.03em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = darkMode
              ? "rgba(34,197,94,0.16)"
              : "rgba(22,163,74,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode
              ? "rgba(34,197,94,0.08)"
              : "rgba(22,163,74,0.1)";
          }}
        >
          <HIcon.Purchase /> Purchase
        </button>

        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            style={btnBase}
            onClick={() => setNotifOpen(!notifOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(172,82,8,0.18)";
              e.currentTarget.style.color = accentHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(22,120,80,0.06)";
              e.currentTarget.style.color = textSec;
            }}
          >
            <HIcon.Bell />
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
                  Notifications
                </span>
                <span
                  style={{
                    color: green,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Mark all read
                </span>
              </div>

              {NOTIFS.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "11px 16px",
                    borderBottom: `1px solid ${cardBorder}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(22,120,80,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
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
                        fontWeight: 500,
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
                  style={{
                    color: green,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          style={btnBase}
          onClick={() => setDarkMode && setDarkMode(!darkMode)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(172,82,8,0.18)";
            e.currentTarget.style.color = accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(22,120,80,0.06)";
            e.currentTarget.style.color = textSec;
          }}
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
              transition: "all 0.2s",
              fontFamily: font,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = darkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(22,120,80,0.08)")
            }
            onMouseLeave={(e) => {
              if (!profileOpen)
                e.currentTarget.style.background = "transparent";
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
                boxShadow: "0 2px 8px rgba(172,82,8,0.4)",
                flexShrink: 0,
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

            <span style={{ color: textMuted, marginLeft: 2 }}>
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
                width: 240,
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
                    margin: "4px 0 0 0",
                    wordBreak: "break-word",
                  }}
                >
                  {displayEmail}
                </p>

                <p
                  style={{
                    color: textMuted,
                    fontSize: 11,
                    margin: "4px 0 0 0",
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
                    fontWeight: 700,
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
                    transition: "background 0.15s",
                    textAlign: "left",
                    fontFamily: font,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(22,120,80,0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
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
                  fontWeight: 600,
                  transition: "background 0.15s",
                  textAlign: "left",
                  fontFamily: font,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <HIcon.Logout />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div
        style={{
          background: darkMode ? "#060f22" : "#e4f0eb",
          borderBottom: `1px solid ${borderClr}`,
          padding: "0 20px",
          display: "flex",
          gap: 0,
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
                  fontWeight: 600,
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
                fontWeight: 700,
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
