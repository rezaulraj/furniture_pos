import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useCustomerStore } from "../../store/customerStore";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

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
  const { t, lang } = useLanguageStore();
  const {
    customers,
    pagination,
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
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [modal, setModal] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = { page, limit: 10 };
    if (statusF !== "all") params.is_active = statusF === "active";
    fetchCustomers(params);
    clearError();
  }, [page, statusF]);

  const handleStatusChange = (val) => {
    setStatusF(val);
    setPage(1);
  };

  // Client-side search on current page data
  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) =>
      c.full_name?.toLowerCase().includes(q) ||
      c.customer_code?.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  }, [customers, search]);

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
    if (!form.full_name.trim()) return lang === "bn" ? "পুরো নাম প্রয়োজন" : "Full name is required";
    if (form.credit_limit !== "" && Number(form.credit_limit) < 0) {
      return lang === "bn" ? "ক্রেডিট লিমিট ০ বা তার বেশি হতে হবে" : "Credit limit must be 0 or more";
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
        useCustomerStore.getState().error || (lang === "bn" ? "কাস্টমার তৈরি করতে ব্যর্থ" : "Failed to create customer"),
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
        useCustomerStore.getState().error || (lang === "bn" ? "কাস্টমার আপডেট করতে ব্যর্থ" : "Failed to update customer"),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(activeCustomer.customer_id);
      closeModal();
    } catch {}
  };

  const total = pagination?.total ?? customers.length;
  const activeCount = customers.filter((c) => c.is_active).length;
  const inactiveCount = customers.filter((c) => !c.is_active).length;

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
          [t("totalCustomers"), total, "👥", T.accent],
          [t("activeCustomers"), activeCount, "✅", T.green],
          [t("inactiveCustomers"), inactiveCount, "🚫", T.red],
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
          placeholder={t("searchCustomer")}
          style={{ ...inputStyle(), flex: 1, minWidth: 220 }}
        />

        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["all", t("all")],
            ["active", t("active")],
            ["inactive", t("inactive")],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => {
                setStatusF(val);
                setPage(1);
              }}
              style={tabBtnStyle(statusF === val)}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            background: T.bg3,
            padding: 4,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            marginLeft: "auto",
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            style={viewBtn(viewMode === "grid")}
          >
            <Ic.LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={viewBtn(viewMode === "table")}
          >
            <Ic.List size={18} />
          </button>
        </div>

        <Btn onClick={openCreate}>
          <Ic.Plus /> {t("addCustomer")}
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

      {viewMode === "grid" && (
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
                {t("noCustomersFound")}
              </p>
              <Btn onClick={openCreate}>
                <Ic.Plus /> {t("addCustomer")}
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
                    {c.is_active
                      ? t("active").toUpperCase()
                      : t("inactive").toUpperCase()}
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
                  <InfoLine label={t("phone")} value={c.phone || "—"} />
                  <InfoLine label={t("email")} value={c.email || "—"} />
                  <InfoLine label={t("type")} value={c.customer_type || "—"} />
                  <InfoLine
                    label={t("credit")}
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
                    <Ic.Eye /> {t("view")}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    style={actionBtn("rgba(172,82,8,.12)", T.accent)}
                  >
                    <Ic.Edit /> {t("edit")}
                  </button>
                  <button onClick={() => openDelete(c)} style={iconBtn()}>
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 800,
              }}
            >
              <thead style={{ background: T.bg2 }}>
                <tr>
                  {[
                    t("customer"),
                    t("contact"),
                    t("type"),
                    t("creditLimit"),
                    t("status"),
                    t("action"),
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: T.textMut,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: 40, textAlign: "center", color: T.textSub }}
                    >
                      {t("loading")}...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: 40, textAlign: "center", color: T.textSub }}
                    >
                      {t("noCustomersFound")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.customer_id}
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: 0 }}>
                          {c.full_name}
                        </p>
                        <p style={{ color: T.textMut, fontSize: 10, margin: "2px 0 0" }}>
                          {c.customer_code || `ID: ${c.customer_id}`}
                        </p>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
                          {c.phone || "—"}
                        </p>
                        <p style={{ color: T.textMut, fontSize: 10.5, margin: "2px 0 0" }}>
                          {c.email || "—"}
                        </p>
                      </td>
                      <td style={{ padding: "12px 14px", color: T.textSub, fontSize: 12 }}>
                        {c.customer_type}
                      </td>
                      <td style={{ padding: "12px 14px", color: T.green, fontWeight: 800, fontSize: 12 }}>
                        {c.credit_limit ? `৳${Number(c.credit_limit).toLocaleString()}` : "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge color={c.is_active ? "green" : "red"} small>
                          {c.is_active ? t("active") : t("inactive")}
                        </Badge>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => openView(c)}
                            style={tableIconBtn(T.green, "rgba(34,197,94,0.1)")}
                          >
                            <Ic.Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            style={tableIconBtn(T.accent, "rgba(172,82,8,0.12)")}
                          >
                            <Ic.Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(c)}
                            style={tableIconBtn(T.red, "rgba(248,113,113,0.1)")}
                          >
                            <Ic.Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />

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
  const { t } = useLanguageStore();
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
            ? t("addCustomer")
            : mode === "edit"
              ? t("edit") + " " + t("customer")
              : t("customerDetails")}
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
          <Field label={`${t("fullName")} *`}>
            <input
              readOnly={isView}
              value={form.full_name}
              onChange={setField("full_name")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label={t("customerType")}>
            <input
              readOnly={isView}
              value={form.customer_type}
              onChange={setField("customer_type")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label={t("phone")}>
            <input
              readOnly={isView}
              value={form.phone}
              onChange={setField("phone")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label={t("email")}>
            <input
              readOnly={isView}
              value={form.email}
              onChange={setField("email")}
              style={inputStyle(isView)}
            />
          </Field>
          <Field label={t("creditLimit")}>
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
          <Field label={t("address")}>
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
              {t("active")} {t("customer").toLowerCase()}
            </label>
          </div>
        )}

        {isView && customer?.sales && (
          <p style={{ color: T.textSub, fontSize: 12 }}>
            {t("totalSalesRecords")}: {customer.sales.length}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {isView ? t("cancel") : t("cancel")}
          </Btn>
          {!isView && (
            <Btn
              onClick={onSubmit}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {loading
                ? t("saving")
                : mode === "create"
                  ? t("addCustomer")
                  : t("saveChanges")}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ customer, loading, onClose, onConfirm }) {
  const { t } = useLanguageStore();
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
        <h3 style={{ color: T.text }}>{t("removeCustomerQuestion")}</h3>
        <p style={{ color: T.textSub }}>
          {customer.full_name} {t("removeCustomerWarning")}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {t("cancel")}
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
            {loading ? t("removing") : t("remove")}
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

function viewBtn(active) {
  return {
    width: 34,
    height: 34,
    borderRadius: 9,
    border: "none",
    background: active ? T.accent : "transparent",
    color: active ? "#fff" : T.textMut,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all .2s",
  };
}

function tableIconBtn(color, bg) {
  return {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: bg,
    color,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all .2s",
  };
}
function tabBtnStyle(active) {
  return {
    height: 34,
    padding: "0 14px",
    borderRadius: 10,
    border: `1px solid ${active ? T.accent : T.border}`,
    background: active ? `${T.accent}15` : T.bg3,
    color: active ? T.accent : T.textSub,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .2s",
  };
}
