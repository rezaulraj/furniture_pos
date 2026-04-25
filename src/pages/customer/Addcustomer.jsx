import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useCustomerStore } from "../../store/customerStore";

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  credit_limit: "",
  customer_type: "retail",
  is_active: true,
};

export default function AddCustomer({ onCancel, onSuccess }) {
  const { createCustomer, isSubmitting, error, clearError } =
    useCustomerStore();
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [savedCustomer, setSavedCustomer] = useState(null);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFormError("");
    clearError();
  };

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (form.credit_limit && Number(form.credit_limit) < 0) {
      return "Credit limit must be 0 or more";
    }
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email?.trim() || null,
        phone: form.phone?.trim() || null,
        address: form.address?.trim() || null,
        credit_limit:
          form.credit_limit === "" ? null : Number(form.credit_limit),
        customer_type: form.customer_type?.trim() || null,
        is_active: form.is_active,
      };

      const customer = await createCustomer(payload);
      setSavedCustomer(customer);
      setForm(EMPTY);
      onSuccess?.(customer);
    } catch {}
  };

  if (savedCustomer) {
    return (
      <div style={{ minHeight: 460, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>✅</div>
          <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            Customer Created
          </h2>
          <p style={{ color: T.textSub }}>
            <strong style={{ color: T.accent }}>
              {savedCustomer.full_name}
            </strong>{" "}
            has been added successfully.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Btn variant="ghost" onClick={() => setSavedCustomer(null)}>
              <Ic.Plus /> Add Another
            </Btn>
            {onCancel && <Btn onClick={onCancel}>View Customers</Btn>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#ac5208,#7a3a06)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontSize: 22,
          }}
        >
          👤
        </div>
        <div>
          <h1
            style={{ color: T.text, fontWeight: 900, fontSize: 22, margin: 0 }}
          >
            Add Customer
          </h1>
          <p style={{ color: T.textSub, fontSize: 12, margin: "4px 0 0" }}>
            Backend-supported fields only
          </p>
        </div>
      </div>

      {(formError || error) && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
          }}
        >
          {formError || error}
        </div>
      )}

      <div style={{ ...card(), padding: "22px 24px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <Field label="Full Name *">
            <input
              value={form.full_name}
              onChange={setField("full_name")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Customer Type">
            <select
              value={form.customer_type}
              onChange={setField("customer_type")}
              style={inputStyle()}
            >
              {["Retail", "Wholesale", "VIP"].map((t) => (
                <option key={t} value={t.toLowerCase()} style={{ background: T.bg3 }}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Phone">
            <input
              value={form.phone}
              onChange={setField("phone")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={setField("email")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Credit Limit">
            <input
              type="number"
              value={form.credit_limit}
              onChange={setField("credit_limit")}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label="Address">
            <textarea
              rows={4}
              value={form.address}
              onChange={setField("address")}
              style={textareaStyle()}
            />
          </Field>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${form.is_active ? "rgba(34,197,94,.25)" : "rgba(248,113,113,.25)"}`,
            background: form.is_active
              ? "rgba(34,197,94,.08)"
              : "rgba(248,113,113,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: T.text, margin: 0, fontWeight: 800 }}>Status</p>
            <p style={{ color: T.textSub, margin: "3px 0 0", fontSize: 11 }}>
              {form.is_active ? "Active customer" : "Inactive customer"}
            </p>
          </div>
          <button
            onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
            style={{
              width: 50,
              height: 28,
              borderRadius: 999,
              border: "none",
              background: form.is_active ? T.green : T.textMut,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 4,
                left: form.is_active ? 26 : 4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </button>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          {onCancel && (
            <Btn variant="ghost" onClick={onCancel}>
              Cancel
            </Btn>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              border: "none",
              borderRadius: 12,
              background: T.accent,
              color: "#fff",
              fontWeight: 800,
              padding: "12px 18px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          color: T.textSub,
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
  };
}

function textareaStyle() {
  return {
    ...inputStyle(),
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  };
}
