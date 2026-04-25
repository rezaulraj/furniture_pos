import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useSupplierStore } from "../../store/supplierStore";

const EMPTY = {
  supplier_name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  gst_number: "",
  payment_terms: "",
  is_active: true,
};

export default function AddSupplier({ onCancel, onSuccess }) {
  const { createSupplier, isSubmitting, error, clearError } =
    useSupplierStore();

  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [savedSupplier, setSavedSupplier] = useState(null);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFormError("");
    clearError();
  };

  const validate = () => {
    if (!form.supplier_name.trim()) return "Supplier name is required";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const payload = {
        supplier_name: form.supplier_name.trim(),
        contact_person: form.contact_person?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        address: form.address?.trim() || null,
        gst_number: form.gst_number?.trim() || null,
        payment_terms: form.payment_terms?.trim() || null,
        is_active: form.is_active,
      };

      const supplier = await createSupplier(payload);
      setSavedSupplier(supplier);
      setForm(EMPTY);
      onSuccess?.(supplier);
    } catch {}
  };

  if (savedSupplier) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 460,
          gap: 18,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.10)",
            border: "2px solid rgba(34,197,94,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
        >
          ✅
        </div>

        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 24,
              margin: "0 0 8px",
            }}
          >
            Supplier Created
          </h2>
          <p
            style={{
              color: T.textSub,
              fontSize: 13,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: T.accent }}>
              {savedSupplier.supplier_name}
            </strong>{" "}
            has been added successfully.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn
            variant="ghost"
            onClick={() => {
              setSavedSupplier(null);
              clearError();
            }}
          >
            <Ic.Plus /> Add Another
          </Btn>

          {onCancel && (
            <Btn onClick={onCancel}>
              <Ic.Eye /> View Suppliers
            </Btn>
          )}
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
            background: "linear-gradient(135deg,#60a5fa,#1d4ed8)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(29,78,216,0.35)",
            fontSize: 22,
          }}
        >
          🏭
        </div>

        <div>
          <h1
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 22,
              margin: 0,
            }}
          >
            Add Supplier
          </h1>
          <p
            style={{
              color: T.textSub,
              fontSize: 12,
              margin: "4px 0 0",
            }}
          >
            Clean supplier form using backend-supported fields only
          </p>
        </div>

        {onCancel && (
          <Btn
            variant="ghost"
            onClick={onCancel}
            style={{ marginLeft: "auto" }}
          >
            <Ic.Close /> Cancel
          </Btn>
        )}
      </div>

      {(formError || error) && (
        <div
          style={{
            ...card(),
            padding: "12px 14px",
            borderLeft: `4px solid ${T.red}`,
            color: T.red,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {formError || error}
        </div>
      )}

      <div style={{ ...card(), padding: "22px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Field label="Supplier Name *">
            <input
              value={form.supplier_name}
              onChange={setField("supplier_name")}
              placeholder="Enter supplier name"
              style={inputStyle()}
            />
          </Field>

          <Field label="Contact Person">
            <input
              value={form.contact_person}
              onChange={setField("contact_person")}
              placeholder="Enter contact person"
              style={inputStyle()}
            />
          </Field>

          <Field label="Phone">
            <input
              value={form.phone}
              onChange={setField("phone")}
              placeholder="Enter phone"
              style={inputStyle()}
            />
          </Field>

          <Field label="Email">
            <input
              value={form.email}
              onChange={setField("email")}
              placeholder="Enter email"
              style={inputStyle()}
            />
          </Field>

          <Field label="GST Number">
            <input
              value={form.gst_number}
              onChange={setField("gst_number")}
              placeholder="Enter GST / tax number"
              style={inputStyle()}
            />
          </Field>

          <Field label="Payment Terms">
            <input
              value={form.payment_terms}
              onChange={setField("payment_terms")}
              placeholder="e.g. Net 30"
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
              placeholder="Enter supplier address"
              style={textareaStyle()}
            />
          </Field>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderRadius: 12,
            background: form.is_active
              ? "rgba(34,197,94,0.08)"
              : "rgba(248,113,113,0.08)",
            border: `1px solid ${
              form.is_active ? "rgba(34,197,94,0.20)" : "rgba(248,113,113,0.20)"
            }`,
          }}
        >
          <div>
            <p
              style={{
                color: T.text,
                margin: 0,
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              Supplier Status
            </p>
            <p
              style={{
                color: T.textSub,
                margin: "3px 0 0",
                fontSize: 11,
              }}
            >
              {form.is_active ? "Active supplier" : "Inactive supplier"}
            </p>
          </div>

          <button
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                is_active: !prev.is_active,
              }))
            }
            style={{
              width: 50,
              height: 28,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: form.is_active ? T.green : T.textMut,
              position: "relative",
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
                transition: "left .2s ease",
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
              fontSize: 13,
              padding: "12px 18px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: "0 10px 24px rgba(172,82,8,0.30)",
            }}
          >
            {isSubmitting ? "Creating..." : "Create Supplier"}
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
          letterSpacing: "0.06em",
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
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  };
}
