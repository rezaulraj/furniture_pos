import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useCustomerStore } from "../../store/customerStore";

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  credit_limit: "",
  customer_type: "Retail",
  is_active: true,
};

export default function AllCustomers() {
  const {
    customers,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [modal, setModal] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchCustomers();
    clearError();
  }, [fetchCustomers, clearError]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matches =
        c.full_name?.toLowerCase().includes(q) ||
        c.customer_code?.toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q);

      const status =
        statusF === "all" ||
        (statusF === "active" ? c.is_active : !c.is_active);

      return matches && status;
    });
  }, [customers, search, statusF]);

  const fillForm = (c) => ({
    full_name: c.full_name || "",
    email: c.email || "",
    phone: c.phone || "",
    address: c.address || "",
    credit_limit: c.credit_limit ?? "",
    customer_type: c.customer_type || "Retail",
    is_active: Boolean(c.is_active),
  });

  const openCreate = () => {
    setModal("create");
    setActiveCustomer(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const openView = async (customer) => {
    try {
      const full = await fetchCustomerById(customer.customer_id);
      setActiveCustomer(full);
      setForm(fillForm(full));
      setModal("view");
    } catch {}
  };

  const openEdit = (customer) => {
    setActiveCustomer(customer);
    setForm(fillForm(customer));
    setModal("edit");
    setFormError("");
    clearError();
  };

  const openDelete = (customer) => {
    setActiveCustomer(customer);
    setModal("delete");
    clearError();
  };

  const closeModal = () => {
    setModal(null);
    setActiveCustomer(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const payload = () => ({
    full_name: form.full_name.trim(),
    email: form.email?.trim() || null,
    phone: form.phone?.trim() || null,
    address: form.address?.trim() || null,
    credit_limit: form.credit_limit === "" ? null : Number(form.credit_limit),
    customer_type: form.customer_type?.trim() || null,
    is_active: form.is_active,
  });

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (form.credit_limit !== "" && Number(form.credit_limit) < 0) {
      return "Credit limit must be 0 or more";
    }
    return "";
  };

  const handleCreate = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      await createCustomer(payload());
      closeModal();
    } catch {
      setFormError(
        useCustomerStore.getState().error || "Failed to create customer",
      );
    }
  };

  const handleUpdate = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      await updateCustomer(activeCustomer.customer_id, payload());
      closeModal();
    } catch {
      setFormError(
        useCustomerStore.getState().error || "Failed to update customer",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(activeCustomer.customer_id);
      closeModal();
    } catch {}
  };

  const total = customers.length;
  const active = customers.filter((c) => c.is_active).length;
  const inactive = customers.filter((c) => !c.is_active).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          ["Total Customers", total, "👥", T.accent],
          ["Active", active, "✅", T.green],
          ["Inactive", inactive, "🚫", T.red],
        ].map(([label, value, icon, color]) => (
          <div
            key={label}
            style={{ ...card(), padding: 16, borderLeft: `4px solid ${color}` }}
          >
            <p
              style={{
                color: T.textSub,
                margin: 0,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {label.toUpperCase()}
            </p>
            <p
              style={{
                color: T.text,
                margin: "6px 0 0",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              {icon} {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          style={{ ...inputStyle(), flex: 1, minWidth: 220 }}
        />

        {["all", "active", "inactive"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusF(s)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 999,
              border: `1px solid ${statusF === s ? "transparent" : T.border}`,
              background: statusF === s ? T.accent : T.bg3,
              color: statusF === s ? "#fff" : T.textSub,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}

        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Customer
        </Btn>
      </div>

      {error && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
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
            <div key={i} style={{ ...card(), minHeight: 220, opacity: 0.6 }} />
          ))
        ) : filtered.length === 0 ? (
          <div
            style={{
              ...card(),
              padding: 40,
              gridColumn: "1/-1",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48 }}>👥</div>
            <p style={{ color: T.textSub, fontWeight: 700 }}>
              No customers found
            </p>
            <Btn onClick={openCreate}>
              <Ic.Plus /> Add Customer
            </Btn>
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.customer_id}
              style={{
                ...card(),
                padding: 18,
                borderTop: `3px solid ${c.is_active ? T.accent : T.textMut}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 900,
                      fontSize: 15,
                      margin: 0,
                    }}
                  >
                    {c.full_name}
                  </p>
                  <p
                    style={{
                      color: T.textMut,
                      fontSize: 10.5,
                      margin: "4px 0 0",
                    }}
                  >
                    {c.customer_code || `ID: ${c.customer_id}`}
                  </p>
                </div>
                <Badge color={c.is_active ? "green" : "red"} small>
                  {c.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div
                style={{
                  margin: "14px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <InfoLine label="Phone" value={c.phone || "—"} />
                <InfoLine label="Email" value={c.email || "—"} />
                <InfoLine label="Type" value={c.customer_type || "—"} />
                <InfoLine
                  label="Credit"
                  value={
                    c.credit_limit
                      ? `৳${Number(c.credit_limit).toLocaleString()}`
                      : "—"
                  }
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openView(c)}
                  style={actionBtn("rgba(34,197,94,.10)", T.green)}
                >
                  <Ic.Eye /> View
                </button>
                <button
                  onClick={() => openEdit(c)}
                  style={actionBtn("rgba(172,82,8,.12)", T.accent)}
                >
                  <Ic.Edit /> Edit
                </button>
                <button onClick={() => openDelete(c)} style={iconBtn()}>
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(modal === "create" || modal === "edit" || modal === "view") && (
        <CustomerModal
          mode={modal}
          customer={activeCustomer}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={modal === "create" ? handleCreate : handleUpdate}
          loading={isSubmitting}
          error={formError}
        />
      )}

      {modal === "delete" && activeCustomer && (
        <DeleteModal
          customer={activeCustomer}
          loading={isDeleting}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function CustomerModal({
  mode,
  customer,
  form,
  setForm,
  onClose,
  onSubmit,
  loading,
  error,
}) {
  const isView = mode === "view";
  const setField = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div style={{ ...card(), width: "100%", maxWidth: 620, padding: 22 }}>
        <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
          {mode === "create"
            ? "Add Customer"
            : mode === "edit"
              ? "Edit Customer"
              : "Customer Details"}
        </h2>

        {error && !isView && <p style={{ color: T.red }}>{error}</p>}

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Field label="Full Name *">
            <input
              readOnly={isView}
              value={form.full_name}
              onChange={setField("full_name")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label="Customer Type">
            <input
              readOnly={isView}
              value={form.customer_type}
              onChange={setField("customer_type")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label="Phone">
            <input
              readOnly={isView}
              value={form.phone}
              onChange={setField("phone")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label="Email">
            <input
              readOnly={isView}
              value={form.email}
              onChange={setField("email")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label="Credit Limit">
            <input
              readOnly={isView}
              type="number"
              value={form.credit_limit}
              onChange={setField("credit_limit")}
              style={inputStyle(isView)}
            />
          </Field>
        </div>

        <div style={{ marginTop: 12 }}>
          <Field label="Address">
            <textarea
              readOnly={isView}
              rows={4}
              value={form.address}
              onChange={setField("address")}
              style={textareaStyle(isView)}
            />
          </Field>
        </div>

        {!isView && (
          <div style={{ marginTop: 12 }}>
            <label style={{ color: T.textSub, fontSize: 12 }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_active: e.target.checked }))
                }
              />{" "}
              Active customer
            </label>
          </div>
        )}

        {isView && customer?.sales && (
          <p style={{ color: T.textSub, fontSize: 12 }}>
            Total sales records: {customer.sales.length}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
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
                ? "Saving..."
                : mode === "create"
                  ? "Create Customer"
                  : "Save Changes"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ customer, loading, onClose, onConfirm }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ ...card(), width: 390, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 42 }}>🗑️</div>
        <h3 style={{ color: T.text }}>Remove Customer?</h3>
        <p style={{ color: T.textSub }}>
          {customer.full_name} will be marked inactive.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
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
              border: "none",
              borderRadius: 9,
              background: "#dc2626",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {loading ? "Removing..." : "Remove"}
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

function InfoLine({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: 6,
      }}
    >
      <span style={{ color: T.textSub, fontSize: 11 }}>{label}</span>
      <span style={{ color: T.text, fontSize: 11.5, fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
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
  };
}

function textareaStyle(readOnly = false) {
  return {
    ...inputStyle(readOnly),
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  };
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

function iconBtn() {
  return {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid rgba(248,113,113,.2)",
    background: "rgba(248,113,113,.1)",
    color: T.red,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  };
}
