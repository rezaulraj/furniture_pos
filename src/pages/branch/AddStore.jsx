import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";

const STEPS = [
  { id: 1, label: "Store Info", icon: "🏪", desc: "Name and type" },
  { id: 2, label: "Location", icon: "📍", desc: "Address & contact" },
  { id: 3, label: "Operations", icon: "⚙️", desc: "Staff & hours" },
  { id: 4, label: "Review", icon: "✅", desc: "Confirm & save" },
];

const TYPE_OPTIONS = [
  {
    type: "Flagship",
    icon: "🏆",
    color: "#f5a623",
    desc: "Primary hub with full range of products and services.",
  },
  {
    type: "Branch",
    icon: "🏪",
    color: "#60a5fa",
    desc: "Standard retail branch in a specific city or region.",
  },
  {
    type: "Warehouse",
    icon: "🏭",
    color: "#4ade80",
    desc: "Storage & distribution centre, not retail-facing.",
  },
  {
    type: "Outlet",
    icon: "🏬",
    color: "#c084fc",
    desc: "Smaller clearance or discount outlet location.",
  },
];

const EMPTY = {
  name: "",
  shortName: "",
  type: "Branch",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  manager: "",
  employees: "",
  workingHours: "Sat–Thu: 10am–8pm",
  isActive: true,
  notes: "",
};

const fi = (label, value, onChange, opts = {}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label
      style={{
        color: T.textSub,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.07em",
      }}
    >
      {label.toUpperCase()}
      {opts.required && " *"}
    </label>
    <input
      type={opts.type || "text"}
      value={value}
      onChange={onChange}
      placeholder={opts.placeholder || ""}
      style={{
        width: "100%",
        background: T.bg3,
        border: `1px solid ${opts.error ? T.red : T.border}`,
        borderRadius: 9,
        padding: "9px 11px",
        color: T.text,
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color .15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = T.gold)}
      onBlur={(e) =>
        (e.target.style.borderColor = opts.error ? T.red : T.border)
      }
    />
    {opts.error && (
      <span style={{ color: T.red, fontSize: 10.5 }}>⚠ {opts.error}</span>
    )}
  </div>
);

export default function AddStore({ onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setVal = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep = (s) => {
    const e = {};
    if (s === 1 && !form.name.trim()) e.name = "Store name is required";
    if (s === 2 && !form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const submit = () => {
    onSave?.({
      ...form,
      id: Date.now(),
      code: `STR-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      employees: parseInt(form.employees) || 0,
      totalSales: 0,
      totalPurchases: 0,
      monthSales: 0,
      inventory: 0,
      openDate: new Date().toISOString().split("T")[0],
    });
    setSaved(true);
  };

  const tc = TYPE_OPTIONS.find((t) => t.type === form.type) || TYPE_OPTIONS[1];

  if (saved)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
          gap: 22,
        }}
      >
        <style>{`@keyframes pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}} @keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: `${tc.color}18`,
            border: `3px solid ${tc.color}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            animation: "pop .55s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {tc.icon}
        </div>
        <div
          style={{ textAlign: "center", animation: "up .4s ease .15s both" }}
        >
          <h2
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 22,
              margin: "0 0 8px",
            }}
          >
            Store Added!
          </h2>
          <p style={{ color: T.textSub, fontSize: 13, margin: "0 0 5px" }}>
            <strong style={{ color: tc.color }}>{form.name}</strong> is now
            registered in the system.
          </p>
          <p style={{ color: T.textMut, fontSize: 11.5, margin: 0 }}>
            {form.type} • {form.city || "Location set"} • {form.employees || 0}{" "}
            staff
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "up .4s ease .28s both",
          }}
        >
          <Btn
            variant="ghost"
            onClick={() => {
              setForm(EMPTY);
              setStep(1);
              setSaved(false);
              setErrors({});
            }}
          >
            <Ic.Plus /> Add Another
          </Btn>
          <Btn onClick={onCancel}>
            <Ic.Eye /> View All Stores
          </Btn>
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <style>{`@keyframes stepIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}} input::placeholder,textarea::placeholder{color:${T.textMut}} select option{background:${T.bg3}} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px} ::-webkit-scrollbar-track{background:transparent}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: `0 4px 14px ${tc.color}45`,
          }}
        >
          {tc.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1
            style={{ color: T.text, fontWeight: 900, fontSize: 20, margin: 0 }}
          >
            Add New Store
          </h1>
          <p style={{ color: T.textSub, fontSize: 11.5, margin: "3px 0 0" }}>
            Register a new store or warehouse location
          </p>
        </div>
        {onCancel && (
          <Btn variant="ghost" onClick={onCancel}>
            <Ic.Close /> Cancel
          </Btn>
        )}
      </div>

      {/* Stepper */}
      <div
        style={{
          ...card(),
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {STEPS.map((s, i) => {
          const isAct = step === s.id,
            isDone = step > s.id;
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < STEPS.length - 1 ? 1 : 0,
              }}
            >
              <div
                onClick={() => isDone && setStep(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  cursor: isDone ? "pointer" : "default",
                  padding: "5px 8px",
                  borderRadius: 10,
                  background: isAct ? `${tc.color}18` : "transparent",
                  transition: "all .18s",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isDone ? 16 : 15,
                    fontWeight: 800,
                    flexShrink: 0,
                    background: isDone ? T.green : isAct ? tc.color : T.bg3,
                    color: isDone || isAct ? "#fff" : T.textMut,
                    border: `2px solid ${isDone ? T.green : isAct ? tc.color : T.border}`,
                    transition: "all .25s",
                  }}
                >
                  {isDone ? "✓" : s.icon}
                </div>
                <div style={{ display: isAct || isDone ? "block" : "none" }}>
                  <p
                    style={{
                      color: isAct ? tc.color : isDone ? T.green : T.textSub,
                      fontWeight: 700,
                      fontSize: 11.5,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {s.label}
                  </p>
                  <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: step > s.id ? T.green : T.border,
                    margin: "0 4px",
                    borderRadius: 2,
                    transition: "background .4s",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div
        style={{
          ...card(),
          padding: "24px 26px",
          animation: "stepIn .3s ease",
          minHeight: 340,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <h2
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 16,
                margin: 0,
              }}
            >
              {STEPS[step - 1].icon} {STEPS[step - 1].label}
            </h2>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              Step {step} of {STEPS.length}
            </p>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((s) => (
              <div
                key={s.id}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: step >= s.id ? tc.color : T.bg3,
                  transition: "background .25s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fi("Store Name", form.name, set("name"), {
              required: true,
              placeholder: "e.g. WoodCraft Chittagong Branch",
              error: errors.name,
            })}
            {fi("Short / Display Name", form.shortName, set("shortName"), {
              placeholder: "e.g. Chittagong Branch",
            })}

            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                STORE TYPE
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {TYPE_OPTIONS.map((opt) => {
                  const isSel = form.type === opt.type;
                  return (
                    <button
                      key={opt.type}
                      onClick={() => setVal("type", opt.type)}
                      style={{
                        padding: "13px 12px",
                        borderRadius: 11,
                        cursor: "pointer",
                        border: `2px solid ${isSel ? opt.color : T.border}`,
                        background: isSel ? opt.color + "18" : T.bg3,
                        transition: "all .2s",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = opt.color + "60";
                          e.currentTarget.style.background = opt.color + "10";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.background = T.bg3;
                        }
                      }}
                    >
                      <span style={{ fontSize: 22, flexShrink: 0 }}>
                        {opt.icon}
                      </span>
                      <div>
                        <p
                          style={{
                            color: isSel ? opt.color : T.text,
                            fontWeight: 800,
                            fontSize: 13,
                            margin: 0,
                          }}
                        >
                          {opt.type}
                        </p>
                        <p
                          style={{
                            color: T.textMut,
                            fontSize: 10,
                            margin: "2px 0 0",
                            lineHeight: 1.4,
                          }}
                        >
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 15px",
                background: form.isActive
                  ? "rgba(74,222,128,0.07)"
                  : "rgba(248,113,113,0.07)",
                border: `1px solid ${form.isActive ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"}`,
                borderRadius: 11,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: T.text,
                    fontWeight: 700,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  Opening Status
                </p>
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "2px 0 0" }}
                >
                  {form.isActive
                    ? "Store will open immediately"
                    : "Store starts as inactive"}
                </p>
              </div>
              <button
                onClick={() => setVal("isActive", !form.isActive)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
                  cursor: "pointer",
                  border: "none",
                  position: "relative",
                  background: form.isActive ? T.green : T.textMut,
                  transition: "background .25s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    left: form.isActive ? 26 : 4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left .25s",
                  }}
                />
              </button>
              <Badge color={form.isActive ? "green" : "red"} small>
                {form.isActive ? "OPEN" : "INACTIVE"}
              </Badge>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("Phone Number", form.phone, set("phone"), {
                required: true,
                placeholder: "e.g. 031-2512345",
                error: errors.phone,
              })}
              {fi("Email Address", form.email, set("email"), {
                type: "email",
                placeholder: "store@woodcraft.com",
              })}
            </div>
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                FULL ADDRESS
              </label>
              <textarea
                value={form.address}
                onChange={set("address")}
                rows={3}
                placeholder="Street address, area, zone..."
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = T.gold)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("City", form.city, set("city"), {
                placeholder: "e.g. Chittagong",
              })}
              {fi("District / Division", form.district, set("district"), {
                placeholder: "e.g. Chattogram",
              })}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {fi("Store Manager", form.manager, set("manager"), {
                placeholder: "Manager full name",
              })}
              {fi("Number of Employees", form.employees, set("employees"), {
                type: "number",
                placeholder: "0",
              })}
            </div>
            {fi("Working Hours", form.workingHours, set("workingHours"), {
              placeholder: "e.g. Sat–Thu: 9am–9pm, Fri: 2pm–9pm",
            })}
            <div>
              <label
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                ADDITIONAL NOTES
              </label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Special instructions, nearby landmarks, parking info..."
                style={{
                  width: "100%",
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "9px 11px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = T.gold)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
            </div>
            <div
              style={{
                padding: "13px 15px",
                background: "rgba(96,165,250,0.07)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 10,
                display: "flex",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>💡</span>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 11.5,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                After adding the store, you can assign users, add inventory, and
                configure separate expense tracking from the store settings.
              </p>
            </div>
          </div>
        )}

        {/* Step 4 - Review */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "20px",
                background: `linear-gradient(135deg,${tc.color}18,rgba(139,90,43,0.06))`,
                borderRadius: 14,
                border: `2px solid ${tc.color}30`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    boxShadow: `0 4px 16px ${tc.color}50`,
                  }}
                >
                  {tc.icon}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 9px",
                        borderRadius: 20,
                        background: tc.color + "20",
                        color: tc.color,
                        border: `1px solid ${tc.color}40`,
                      }}
                    >
                      {form.type.toUpperCase()}
                    </span>
                    <Badge color={form.isActive ? "green" : "red"} small>
                      {form.isActive ? "OPEN" : "INACTIVE"}
                    </Badge>
                  </div>
                  <h2
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 18,
                      margin: "0 0 3px",
                    }}
                  >
                    {form.name || "—"}
                  </h2>
                  {form.shortName && (
                    <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
                      {form.shortName}
                    </p>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 8,
                }}
              >
                {[
                  ["📞 Phone", form.phone || "—"],
                  ["✉️ Email", form.email || "—"],
                  [
                    "📍 City",
                    form.city ? `${form.city}, ${form.district || ""}` : "—",
                  ],
                  ["🕐 Hours", form.workingHours || "—"],
                  ["👤 Manager", form.manager || "—"],
                  ["👥 Staff", form.employees || "0"],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      padding: "9px 12px",
                      background: "rgba(139,90,43,0.08)",
                      borderRadius: 9,
                    }}
                  >
                    <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                      {l}
                    </p>
                    <p
                      style={{
                        color: T.text,
                        fontWeight: 600,
                        fontSize: 12,
                        margin: "2px 0 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
              {form.address && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "9px 12px",
                    background: "rgba(139,90,43,0.08)",
                    borderRadius: 9,
                  }}
                >
                  <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                    🏠 Full Address
                  </p>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 600,
                      fontSize: 12,
                      margin: "2px 0 0",
                      lineHeight: 1.4,
                    }}
                  >
                    {form.address}
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.22)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>✅</span>
              <p
                style={{
                  color: T.green,
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Everything looks good! Click "Add Store" to register this
                location.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Btn variant="ghost" onClick={prev} disabled={step === 1}>
          <Ic.ChevDown open={false} /> Previous
        </Btn>
        {step < 4 ? (
          <Btn
            onClick={next}
            style={{
              background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
              border: "none",
            }}
          >
            Next: {STEPS[step].label} <Ic.ChevDown open={true} />
          </Btn>
        ) : (
          <Btn
            onClick={submit}
            style={{
              background: `linear-gradient(135deg,${tc.color},${T.goldD})`,
              border: "none",
            }}
          >
            <Ic.Check /> Add Store
          </Btn>
        )}
      </div>
    </div>
  );
}
