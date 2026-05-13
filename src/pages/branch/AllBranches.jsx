import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useBranchStore } from "../../store/branchStore";
import { Pagination } from "../../components/Pagination";

const EMPTY_FORM = {
  store_name: "",
  address: "",
  phone: "",
  email: "",
  is_active: true,
};

function BranchModal({
  mode,
  branch,
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
      ? "Add New Branch"
      : mode === "edit"
        ? "Edit Branch"
        : "Branch Details";

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
          maxWidth: 560,
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                boxShadow: "0 8px 24px rgba(172,82,8,0.35)",
              }}
            >
              🏪
            </div>
            <div>
              <h2
                style={{
                  color: T.text,
                  fontWeight: 900,
                  fontSize: 17,
                  margin: 0,
                }}
              >
                {title}
              </h2>
              {branch?.store_id && (
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 11,
                    margin: "3px 0 0",
                  }}
                >
                  Branch ID: {branch.store_id}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: T.red,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            {Ic.Close ? <Ic.Close /> : <span style={{ fontSize: 18 }}>×</span>}
          </button>
        </div>

        <div
          style={{
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            overflowY: "auto",
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

          <Field label="Branch Name *">
            <input
              value={form.store_name}
              onChange={setField("store_name")}
              readOnly={isView}
              placeholder="Enter branch name"
              style={inputStyle(isView)}
            />
          </Field>

          <Field label="Address">
            <textarea
              rows={3}
              value={form.address}
              onChange={setField("address")}
              readOnly={isView}
              placeholder="Enter address"
              style={textareaStyle(isView)}
            />
          </Field>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={setField("phone")}
                readOnly={isView}
                placeholder="Enter phone number"
                style={inputStyle(isView)}
              />
            </Field>

            <Field label="Email">
              <input
                value={form.email}
                onChange={setField("email")}
                readOnly={isView}
                placeholder="Enter email"
                style={inputStyle(isView)}
              />
            </Field>
          </div>

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
                Branch Status
              </p>
              <p
                style={{
                  color: T.textSub,
                  margin: "3px 0 0",
                  fontSize: 11,
                }}
              >
                {form.is_active ? "Active branch" : "Inactive branch"}
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
        </div>

        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 10,
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
            <button
              onClick={onSubmit}
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 12,
                background: T.accent,
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Branch"
                  : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ branch, loading, onClose, onConfirm }) {
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
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 420,
          padding: "28px 24px",
          textAlign: "center",
          boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 14 }}>🗑️</div>

        <h3
          style={{
            color: T.text,
            fontWeight: 900,
            fontSize: 17,
            margin: "0 0 8px",
          }}
        >
          Deactivate Branch?
        </h3>

        <p
          style={{
            color: T.textSub,
            fontSize: 12.5,
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: T.text }}>{branch?.store_name}</strong> will
          be soft-deleted and marked inactive.
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
            {branch?.store_name}
          </p>
          <p style={{ color: T.textSub, fontSize: 10.5, margin: "3px 0 0" }}>
            {branch?.phone || "No phone"} • {branch?.email || "No email"}
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
            {loading ? "Removing..." : "Remove Branch"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllBranches() {
  const {
    branches,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranchStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [modal, setModal] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = { page, limit: 10 };
    if (statusF !== "all") params.is_active = statusF === "active";
    fetchBranches(params);
    clearError();
  }, [page, statusF]);

  const handleStatusChange = (val) => {
    setStatusF(val);
    setPage(1);
  };

  // Client-side search filter on current page data
  const filtered = useMemo(() => {
    if (!search.trim()) return branches;
    const q = search.toLowerCase();
    return branches.filter((b) =>
      b.store_name?.toLowerCase().includes(q) ||
      (b.phone || "").toLowerCase().includes(q) ||
      (b.email || "").toLowerCase().includes(q) ||
      (b.address || "").toLowerCase().includes(q)
    );
  }, [branches, search]);

  const openCreate = () => {
    setModal("create");
    setActiveBranch(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const openView = (branch) => {
    setModal("view");
    setActiveBranch(branch);
    setForm({
      store_name: branch.store_name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
      is_active: Boolean(branch.is_active),
    });
    setFormError("");
    clearError();
  };

  const openEdit = (branch) => {
    setModal("edit");
    setActiveBranch(branch);
    setForm({
      store_name: branch.store_name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
      is_active: Boolean(branch.is_active),
    });
    setFormError("");
    clearError();
  };

  const openDelete = (branch) => {
    setModal("delete");
    setActiveBranch(branch);
    setFormError("");
    clearError();
  };

  const closeModal = () => {
    setModal(null);
    setActiveBranch(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const validateForm = () => {
    if (!form.store_name.trim()) return "Branch name is required";
    return "";
  };

  const handleCreate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await createBranch({
        store_name: form.store_name.trim(),
        address: form.address?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setFormError(
        useBranchStore.getState().error || "Failed to create branch",
      );
    }
  };

  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await updateBranch(activeBranch.store_id, {
        store_name: form.store_name.trim(),
        address: form.address?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setFormError(
        useBranchStore.getState().error || "Failed to update branch",
      );
    }
  };

  const handleDelete = async () => {
    if (!activeBranch) return;

    try {
      await deleteBranch(activeBranch.store_id);
      closeModal();
    } catch {
      // store error shown
    }
  };

  const total = pagination?.total ?? branches.length;
  const active = branches.filter((b) => b.is_active).length;
  const inactive = branches.filter((b) => !b.is_active).length;

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
            label: "Total Branches",
            value: total,
            sub: "All branch records",
            color: T.accent,
            icon: "🏪",
          },
          {
            label: "Active",
            value: active,
            sub: "Operational branches",
            color: T.green,
            icon: "✅",
          },
          {
            label: "Inactive",
            value: inactive,
            sub: "Soft-deleted branches",
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
            placeholder="Search by branch name, phone, email, address..."
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
            style={viewBtnStyle(viewMode === "grid")}
          >
            <Ic.LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={viewBtnStyle(viewMode === "table")}
          >
            <Ic.List size={18} />
          </button>
        </div>

        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Branch
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
              <div
                key={i}
                style={{
                  ...card(),
                  minHeight: 220,
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
              <div style={{ fontSize: 48, marginBottom: 14 }}>🏪</div>
              <p style={{ color: T.textSub, fontWeight: 700, margin: "0 0 16px" }}>
                No branches found.
              </p>
              <Btn onClick={openCreate} style={{ margin: "0 auto" }}>
                <Ic.Plus /> Add Branch
              </Btn>
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.store_id}
                style={{
                  ...card(),
                  padding: 20,
                  borderTop: `4px solid ${b.is_active ? T.accent : T.textMut}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: T.text,
                        fontWeight: 900,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      {b.store_name}
                    </h3>
                    <p style={{ color: T.textMut, fontSize: 10.5, margin: "4px 0 0" }}>
                      ID: {b.store_id}
                    </p>
                  </div>
                  <Badge color={b.is_active ? "green" : "red"} small>
                    {b.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>

                <div
                  style={{
                    margin: "18px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <InfoItem icon={<Ic.Phone size={14} />} value={b.phone || "—"} />
                  <InfoItem icon={<Ic.Mail size={14} />} value={b.email || "—"} />
                  <InfoItem
                    icon={<Ic.MapPin size={14} />}
                    value={b.address || "—"}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 16,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <button
                    onClick={() => openView(b)}
                    style={actionBtnStyle("rgba(34,197,94,0.1)", T.green)}
                  >
                    <Ic.Eye /> View
                  </button>
                  <button
                    onClick={() => openEdit(b)}
                    style={actionBtnStyle("rgba(172,82,8,0.12)", T.accent)}
                  >
                    <Ic.Edit /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(b)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
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
                    "Branch",
                    "Address",
                    "Contact",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: T.textMut,
                        fontSize: 10.5,
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
                      colSpan={5}
                      style={{ padding: 40, textAlign: "center", color: T.textSub }}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: 40, textAlign: "center", color: T.textSub }}
                    >
                      No branches found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr
                      key={b.store_id}
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: 0 }}>
                          {b.store_name}
                        </p>
                        <p style={{ color: T.textMut, fontSize: 10, margin: "2px 0 0" }}>
                          ID: {b.store_id}
                        </p>
                      </td>
                      <td style={{ padding: "12px 14px", color: T.textSub, fontSize: 12, maxWidth: 240 }}>
                        {b.address || "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
                          {b.phone || "—"}
                        </p>
                        <p style={{ color: T.textMut, fontSize: 10.5, margin: "2px 0 0" }}>
                          {b.email || "—"}
                        </p>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge color={b.is_active ? "green" : "red"} small>
                          {b.is_active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => openView(b)}
                            style={tableActionBtn(T.green, "rgba(34,197,94,0.1)")}
                          >
                            <Ic.Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(b)}
                            style={tableActionBtn(T.accent, "rgba(172,82,8,0.12)")}
                          >
                            <Ic.Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(b)}
                            style={tableActionBtn(T.red, "rgba(248,113,113,0.1)")}
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
        <BranchModal
          mode={modal}
          branch={activeBranch}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={modal === "create" ? handleCreate : handleUpdate}
          loading={isSubmitting}
          error={formError}
        />
      )}

      {modal === "delete" && activeBranch && (
        <DeleteModal
          branch={activeBranch}
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

function actionBtnStyle(bg, color) {
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

function viewBtnStyle(active) {
  return {
    width: 36,
    height: 36,
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

function tableActionBtn(color, bg) {
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
