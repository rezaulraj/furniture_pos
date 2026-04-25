import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useSupplierStore } from "../../store/supplierStore";

const EMPTY_FORM = {
  supplier_name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  gst_number: "",
  payment_terms: "",
  is_active: true,
};

function SupplierModal({
  mode,
  supplier,
  form,
  setForm,
  onClose,
  onSubmit,
  loading,
  error,
}) {
  const isView = mode === "view";
  const title =
    mode === "create"
      ? "Add Supplier"
      : mode === "edit"
        ? "Edit Supplier"
        : "Supplier Details";

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 620,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            padding: "20px 22px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg,#60a5fa,#1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(29,78,216,0.4)",
              }}
            >
              {form.supplier_name ? form.supplier_name[0].toUpperCase() : "?"}
            </div>
            <div>
              <h2
                style={{
                  color: T.text,
                  fontWeight: 900,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                {title}
              </h2>
              {supplier?.supplier_id && (
                <p
                  style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}
                >
                  Supplier ID: {supplier.supplier_id}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: T.red,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Ic.Close ? <Ic.Close /> : <span style={{ fontSize: 18 }}>×</span>}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {error && !isView && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.22)",
                color: T.red,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Field label="Supplier Name *">
              <input
                value={form.supplier_name}
                onChange={setField("supplier_name")}
                readOnly={isView}
                placeholder="Supplier name"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="Contact Person">
              <input
                value={form.contact_person}
                onChange={setField("contact_person")}
                readOnly={isView}
                placeholder="Contact person"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="Phone">
              <input
                value={form.phone}
                onChange={setField("phone")}
                readOnly={isView}
                placeholder="Phone"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="Email">
              <input
                value={form.email}
                onChange={setField("email")}
                readOnly={isView}
                placeholder="Email"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="GST Number">
              <input
                value={form.gst_number}
                onChange={setField("gst_number")}
                readOnly={isView}
                placeholder="GST number"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="Payment Terms">
              <input
                value={form.payment_terms}
                onChange={setField("payment_terms")}
                readOnly={isView}
                placeholder="Payment terms"
                style={inputStyle(isView)}
              />
            </Field>
          </div>

          <Field label="Address">
            <textarea
              rows={4}
              value={form.address}
              onChange={setField("address")}
              readOnly={isView}
              placeholder="Address"
              style={textareaStyle(isView)}
            />
          </Field>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: 12,
              background: form.is_active
                ? "rgba(34,197,94,0.08)"
                : "rgba(248,113,113,0.08)",
              border: `1px solid ${
                form.is_active
                  ? "rgba(34,197,94,0.20)"
                  : "rgba(248,113,113,0.20)"
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

            {isView ? (
              <Badge color={form.is_active ? "green" : "red"} small>
                {form.is_active ? "ACTIVE" : "INACTIVE"}
              </Badge>
            ) : (
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
            )}
          </div>

          {isView && supplier?.purchases && (
            <div style={{ ...card(), padding: "14px 16px" }}>
              <p
                style={{
                  color: T.textMut,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.07em",
                  margin: "0 0 8px",
                }}
              >
                PURCHASE HISTORY
              </p>
              <p style={{ color: T.text, fontSize: 13, margin: 0 }}>
                Total purchases: <strong>{supplier.purchases.length}</strong>
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 8,
          }}
        >
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {isView ? "Close" : "Cancel"}
          </Btn>

          {!isView && (
            <Btn
              onClick={onSubmit}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Supplier"
                  : "Save Changes"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ supplier, loading, onClose, onConfirm }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          ...card(),
          width: 400,
          padding: "26px 24px",
          textAlign: "center",
          boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            background: "rgba(239,68,68,0.12)",
            border: "2px solid rgba(239,68,68,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 16px",
          }}
        >
          🗑️
        </div>

        <h3
          style={{
            color: T.text,
            fontWeight: 900,
            fontSize: 17,
            margin: "0 0 8px",
          }}
        >
          Remove Supplier?
        </h3>

        <p
          style={{
            color: T.textSub,
            fontSize: 12.5,
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: T.text }}>{supplier?.supplier_name}</strong>{" "}
          will be soft-deleted and marked inactive.
        </p>

        <div
          style={{
            padding: "10px 13px",
            background: "rgba(248,113,113,0.07)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 9,
            marginBottom: 18,
            textAlign: "left",
          }}
        >
          <p
            style={{ color: T.text, fontWeight: 700, fontSize: 12, margin: 0 }}
          >
            {supplier?.supplier_name}
          </p>
          <p style={{ color: T.textSub, fontSize: 10.5, margin: "2px 0 0" }}>
            {supplier?.phone || "No phone"} • {supplier?.email || "No email"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 9 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "9px",
              background: "linear-gradient(135deg,#dc2626,#991b1b)",
              border: "none",
              borderRadius: 9,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Removing..." : "Remove Supplier"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllSuppliers() {
  const {
    suppliers,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchSupplierById,
  } = useSupplierStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [modal, setModal] = useState(null);
  const [activeSupplier, setActiveSupplier] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchSuppliers();
    clearError();
  }, [fetchSuppliers, clearError]);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
        (s.contact_person || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.phone || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusF === "all" ||
        (statusF === "active" ? s.is_active : !s.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, statusF]);

  const openCreate = () => {
    setModal("create");
    setActiveSupplier(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const openView = async (supplier) => {
    try {
      const fullSupplier = await fetchSupplierById(supplier.supplier_id);
      setActiveSupplier(fullSupplier);
      setForm({
        supplier_name: fullSupplier.supplier_name || "",
        contact_person: fullSupplier.contact_person || "",
        phone: fullSupplier.phone || "",
        email: fullSupplier.email || "",
        address: fullSupplier.address || "",
        gst_number: fullSupplier.gst_number || "",
        payment_terms: fullSupplier.payment_terms || "",
        is_active: Boolean(fullSupplier.is_active),
      });
      setModal("view");
    } catch {}
  };

  const openEdit = (supplier) => {
    setModal("edit");
    setActiveSupplier(supplier);
    setForm({
      supplier_name: supplier.supplier_name || "",
      contact_person: supplier.contact_person || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      gst_number: supplier.gst_number || "",
      payment_terms: supplier.payment_terms || "",
      is_active: Boolean(supplier.is_active),
    });
    setFormError("");
    clearError();
  };

  const openDelete = (supplier) => {
    setModal("delete");
    setActiveSupplier(supplier);
    setFormError("");
    clearError();
  };

  const closeModal = () => {
    setModal(null);
    setActiveSupplier(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const validate = () => {
    if (!form.supplier_name.trim()) return "Supplier name is required";
    return "";
  };

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await createSupplier({
        supplier_name: form.supplier_name.trim(),
        contact_person: form.contact_person?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        address: form.address?.trim() || null,
        gst_number: form.gst_number?.trim() || null,
        payment_terms: form.payment_terms?.trim() || null,
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setFormError(
        useSupplierStore.getState().error || "Failed to create supplier",
      );
    }
  };

  const handleUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await updateSupplier(activeSupplier.supplier_id, {
        supplier_name: form.supplier_name.trim(),
        contact_person: form.contact_person?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        address: form.address?.trim() || null,
        gst_number: form.gst_number?.trim() || null,
        payment_terms: form.payment_terms?.trim() || null,
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setFormError(
        useSupplierStore.getState().error || "Failed to update supplier",
      );
    }
  };

  const handleDelete = async () => {
    if (!activeSupplier) return;

    try {
      await deleteSupplier(activeSupplier.supplier_id);
      closeModal();
    } catch {}
  };

  const total = suppliers.length;
  const active = suppliers.filter((s) => s.is_active).length;
  const inactive = suppliers.filter((s) => !s.is_active).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Suppliers",
            value: total,
            sub: "All supplier records",
            color: T.accent,
            icon: "🏭",
          },
          {
            label: "Active",
            value: active,
            sub: "Available suppliers",
            color: T.green,
            icon: "✅",
          },
          {
            label: "Inactive",
            value: inactive,
            sub: "Soft-deleted suppliers",
            color: T.red,
            icon: "🚫",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              ...card(),
              padding: "15px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderLeft: `4px solid ${k.color}`,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `${k.color}18`,
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 10,
                  margin: 0,
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: T.text,
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "2px 0",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "0 12px",
            height: 42,
          }}
        >
          <span style={{ color: T.textMut, display: "flex" }}>
            <Ic.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, contact, phone, email..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: T.text,
              fontSize: 13,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["all", "All"],
            ["active", "Active"],
            ["inactive", "Inactive"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatusF(value)}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 999,
                border: `1px solid ${
                  statusF === value ? "transparent" : T.border
                }`,
                background:
                  statusF === value
                    ? `linear-gradient(135deg, ${T.accent}, ${T.accent})`
                    : T.bg3,
                color: statusF === value ? "#fff" : T.textSub,
                fontWeight: 800,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Supplier
        </Btn>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: 14,
        }}
      >
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                ...card(),
                minHeight: 230,
                opacity: 0.6,
              }}
            />
          ))
        ) : filtered.length === 0 ? (
          <div
            style={{
              ...card(),
              padding: 40,
              gridColumn: "1 / -1",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 10 }}>🏭</div>
            <p
              style={{
                color: T.textSub,
                fontSize: 14,
                fontWeight: 700,
                margin: 0,
              }}
            >
              No suppliers found
            </p>
            <Btn onClick={openCreate} style={{ marginTop: 14 }}>
              <Ic.Plus /> Add Supplier
            </Btn>
          </div>
        ) : (
          filtered.map((supplier) => (
            <div
              key={supplier.supplier_id}
              style={{
                ...card(),
                padding: 18,
                borderTop: `3px solid ${
                  supplier.is_active ? T.accent : T.textMut
                }`,
                opacity: supplier.is_active ? 1 : 0.7,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 15,
                      margin: "0 0 4px",
                    }}
                  >
                    {supplier.supplier_name}
                  </p>
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 10.5,
                      margin: 0,
                    }}
                  >
                    Supplier ID: {supplier.supplier_id}
                  </p>
                </div>

                <Badge color={supplier.is_active ? "green" : "red"} small>
                  {supplier.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <InfoLine
                  label="Contact"
                  value={supplier.contact_person || "—"}
                />
                <InfoLine label="Phone" value={supplier.phone || "—"} />
                <InfoLine label="Email" value={supplier.email || "—"} />
                <InfoLine
                  label="Payment Terms"
                  value={supplier.payment_terms || "—"}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openView(supplier)}
                  style={actionBtn("rgba(34,197,94,0.10)", T.green)}
                >
                  <Ic.Eye /> View
                </button>

                <button
                  onClick={() => openEdit(supplier)}
                  style={actionBtn("rgba(172,82,8,0.12)", T.accent)}
                >
                  <Ic.Edit /> Edit
                </button>

                <button
                  onClick={() => openDelete(supplier)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "1px solid rgba(248,113,113,0.2)",
                    background: "rgba(248,113,113,0.1)",
                    color: T.red,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(modal === "create" || modal === "edit" || modal === "view") && (
        <SupplierModal
          mode={modal}
          supplier={activeSupplier}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={modal === "create" ? handleCreate : handleUpdate}
          loading={isSubmitting}
          error={formError}
        />
      )}

      {modal === "delete" && activeSupplier && (
        <DeleteModal
          supplier={activeSupplier}
          loading={isDeleting}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
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

function InfoLine({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "7px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <span style={{ color: T.textSub, fontSize: 11 }}>{label}</span>
      <span
        style={{
          color: T.text,
          fontSize: 11.5,
          fontWeight: 600,
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function actionBtn(bg, color) {
  return {
    flex: 1,
    height: 36,
    borderRadius: 10,
    background: bg,
    border: `1px solid ${T.border}`,
    color,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  };
}

function inputStyle(readOnly = false) {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: readOnly ? T.bg2 : T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
    cursor: readOnly ? "default" : "text",
  };
}

function textareaStyle(readOnly = false) {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: readOnly ? T.bg2 : T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
    cursor: readOnly ? "default" : "text",
  };
}
