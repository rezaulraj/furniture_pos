import { T } from "../theme/colors";

export const Badge = ({ children, color = "gold", small }) => {
  const map = {
    gold: {
      bg: "rgba(205,133,63,0.18)",
      color: "#cd853f",
      border: "rgba(205,133,63,0.3)",
    },
    green: {
      bg: "rgba(74,222,128,0.12)",
      color: "#4ade80",
      border: "rgba(74,222,128,0.25)",
    },
    red: {
      bg: "rgba(248,113,113,0.12)",
      color: "#f87171",
      border: "rgba(248,113,113,0.25)",
    },
    yellow: {
      bg: "rgba(251,191,36,0.12)",
      color: "#fbbf24",
      border: "rgba(251,191,36,0.25)",
    },
    blue: {
      bg: "rgba(96,165,250,0.12)",
      color: "#60a5fa",
      border: "rgba(96,165,250,0.25)",
    },
    purple: {
      bg: "rgba(192,132,252,0.12)",
      color: "#c084fc",
      border: "rgba(192,132,252,0.25)",
    },
  };
  const c = map[color] || map.gold;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontSize: small ? 9 : 10,
        fontWeight: 700,
        padding: small ? "1px 6px" : "2px 9px",
        borderRadius: 20,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    paid: "green",
    partial: "yellow",
    pending: "red",
    active: "blue",
    overdue: "red",
    completed: "green",
    approved: "yellow",
    cancelled: "red",
  };
  return <Badge color={map[status] || "gold"}>{status.toUpperCase()}</Badge>;
};
