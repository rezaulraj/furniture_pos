import { T } from "../theme/colors";

export const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  readOnly,
  style: sx = {},
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && (
      <label
        style={{
          color: T.textSub,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.07em",
        }}
      >
        {label.toUpperCase()}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {icon && (
        <span
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: T.textMut,
            display: "flex",
          }}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          width: "100%",
          background: readOnly ? T.bg2 : T.bg3,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: `9px ${icon ? "10px 9px 32px" : "10px"}`,
          color: T.text,
          fontSize: 12,
          outline: "none",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
          ...sx,
        }}
        onFocus={(e) => (e.target.style.borderColor = T.gold)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      />
    </div>
  </div>
);

export const Select = ({ label, value, onChange, options, style: sx = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && (
      <label
        style={{
          color: T.textSub,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.07em",
        }}
      >
        {label.toUpperCase()}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      style={{
        background: T.bg3,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "9px 10px",
        color: T.text,
        fontSize: 12,
        outline: "none",
        transition: "border-color 0.15s",
        cursor: "pointer",
        ...sx,
      }}
      onFocus={(e) => (e.target.style.borderColor = T.gold)}
      onBlur={(e) => (e.target.style.borderColor = T.border)}
    >
      {options.map((o) => (
        <option
          key={o.value ?? o}
          value={o.value ?? o}
          style={{ background: T.bg3 }}
        >
          {o.label ?? o}
        </option>
      ))}
    </select>
  </div>
);
