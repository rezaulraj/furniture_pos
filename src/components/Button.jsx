import { T } from "../theme/colors";

export const Btn = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  style: sx = {},
}) => {
  const sizes = {
    sm: { padding: "5px 12px", fontSize: 11 },
    md: { padding: "8px 16px", fontSize: 12 },
    lg: { padding: "10px 22px", fontSize: 13 },
  };
  const vars = {
    primary: {
      background: "linear-gradient(135deg,#c0712a,#8b3e10)",
      color: "#fff",
      border: "none",
      boxShadow: "0 3px 12px rgba(139,69,19,0.4)",
    },
    ghost: {
      background: "rgba(139,90,43,0.15)",
      color: T.gold,
      border: `1px solid rgba(139,90,43,0.35)`,
    },
    danger: {
      background: "rgba(248,113,113,0.12)",
      color: T.red,
      border: "1px solid rgba(248,113,113,0.3)",
    },
    success: {
      background: "rgba(74,222,128,0.12)",
      color: T.green,
      border: "1px solid rgba(74,222,128,0.3)",
    },
    dark: { background: T.bg3, color: T.text, border: `1px solid ${T.border}` },
  };
  const v = vars[variant] || vars.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizes[size],
        ...v,
        borderRadius: 9,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: "0.02em",
        transition: "all 0.18s",
        ...sx,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.opacity = "0.9";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </button>
  );
};
