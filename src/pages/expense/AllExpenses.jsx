import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Pagination } from "../../components/Pagination";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Input, Select } from "../../components/Input";
import { Ic } from "../../components/Icons";
import { useExpenseStore } from "../../store/expenseStore";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function AllExpenses() {
  const { t } = useLanguageStore();
  const {
    expenses,
    pagination,
    isLoading,
    error,
    fetchExpenses,
    updateExpenseStatus,
    clearError,
  } = useExpenseStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const params = { page, limit: 10, search };
    if (statusFilter !== "all") params.status = statusFilter;
    fetchExpenses(params);
    clearError?.();
  }, [page, statusFilter, search, fetchExpenses, clearError]);

  const filtered = expenses;

  const stats = useMemo(() => {
    return {
      total: filtered.reduce((a, b) => a + Number(b.amount || 0), 0),
      pending: filtered.filter((e) => e.status === "pending").length,
      paid: filtered.filter((e) => e.status === "paid").length,
    };
  }, [filtered]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateExpenseStatus(id, status);
    } catch {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <StatCard label={t("totalExpenses")} value={money(stats.total)} color={T.accent} />
        <StatCard label={t("pendingApproval")} value={stats.pending} color={T.yellow} />
        <StatCard label={t("totalPaid")} value={stats.paid} color={T.green} />
      </div>

      <div style={{ ...card(), padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Input
            icon={<Ic.Search />}
            placeholder={t("searchExpenses")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: t("allStatus") },
            { value: "pending", label: t("pending") },
            { value: "approved", label: t("approved") },
            { value: "cancelled", label: t("cancelled") },
          ]}
        />

        <div
          style={{
            display: "flex",
            gap: 4,
            background: T.bg3,
            padding: 4,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
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

        <Btn onClick={() => (window.location.href = "/expenses/add")}>
          <Ic.Plus /> {t("addExpense")}
        </Btn>
      </div>

      {error && <div style={{ color: T.red, fontWeight: 700 }}>{error}</div>}

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
              <div key={i} style={{ ...card(), minHeight: 180, opacity: 0.6 }} />
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
              <div style={{ fontSize: 48 }}>💸</div>
              <p style={{ color: T.textSub, fontWeight: 700 }}>
                {t("noExpensesFound")}
              </p>
            </div>
          ) : (
            filtered.map((exp) => (
              <div
                key={exp.expense_id}
                style={{
                  ...card(),
                  padding: 18,
                  borderTop: `3px solid ${
                    exp.status === "paid"
                      ? T.green
                      : exp.status === "pending"
                        ? T.yellow
                        : T.accent
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
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
                      {exp.expense_title}
                    </p>
                    <p style={{ color: T.textMut, fontSize: 10, margin: "2px 0 0" }}>
                      {exp.expense_code}
                    </p>
                  </div>
                  <StatusBadge status={exp.status} />
                </div>

                <div
                  style={{
                    margin: "14px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <InfoLine label={t("category")} value={exp.category?.category_name} />
                  <InfoLine label={t("store")} value={exp.store?.store_name} />
                  <InfoLine label={t("amount")} value={money(exp.amount)} strong />
                  <InfoLine label={t("date")} value={new Date(exp.expense_date).toLocaleDateString()} />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  {exp.status === "pending" && (
                    <button
                      onClick={() => handleStatusUpdate(exp.expense_id, "approved")}
                      style={{ ...actionBtn(T.blue), flex: 1 }}
                    >
                      {t("approve")}
                    </button>
                  )}
                  {exp.status === "approved" && (
                    <button
                      onClick={() => handleStatusUpdate(exp.expense_id, "paid")}
                      style={{ ...actionBtn(T.green), flex: 1 }}
                    >
                      {t("markPaid")}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: T.bg2 }}>
              <tr>
                {[
                  t("date"),
                  t("title"),
                  t("category"),
                  t("store"),
                  t("amount"),
                  t("method"),
                  t("status"),
                  t("action"),
                ].map((h) => (
                  <th key={h} style={thStyle()}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center" }}>
                    {t("loading")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center" }}>
                    {t("noExpensesFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr
                    key={exp.expense_id}
                    style={{ borderBottom: `1px solid ${T.border}` }}
                  >
                    <td style={tdStyle()}>
                      {new Date(exp.expense_date).toLocaleDateString()}
                    </td>
                    <td style={tdStyle()}>
                      <span style={{ fontWeight: 700, color: T.text }}>
                        {exp.expense_title}
                      </span>
                      <p
                        style={{ margin: "2px 0 0", fontSize: 10, color: T.textMut }}
                      >
                        {exp.expense_code}
                      </p>
                    </td>
                    <td style={tdStyle()}>{exp.category?.category_name}</td>
                    <td style={tdStyle()}>{exp.store?.store_name}</td>
                    <td style={tdStrongStyle(T.text)}>{money(exp.amount)}</td>
                    <td style={tdStyle()}>{exp.payment_method}</td>
                    <td style={tdStyle()}>
                      <StatusBadge status={exp.status} />
                    </td>
                    <td style={tdStyle()}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {exp.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(exp.expense_id, "approved")
                            }
                            style={actionBtn(T.blue)}
                          >
                            {t("approve")}
                          </button>
                        )}
                        {exp.status === "approved" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(exp.expense_id, "paid")
                            }
                            style={actionBtn(T.green)}
                          >
                            {t("markPaid")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...card(), padding: "16px", borderLeft: `4px solid ${color}` }}>
      <p style={{ color: T.textSub, fontSize: 10, margin: 0, fontWeight: 800 }}>{label.toUpperCase()}</p>
      <p style={{ color, fontSize: 22, fontWeight: 900, margin: "4px 0 0" }}>{value}</p>
    </div>
  );
}

function thStyle() {
  return {
    padding: "12px 14px",
    textAlign: "left",
    color: T.textMut,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    borderBottom: `1px solid ${T.border}`,
  };
}
function tdStyle() {
  return { padding: "12px 10px", fontSize: 12, color: T.textSub };
}
function tdStrongStyle(color) {
  return { ...tdStyle(), color, fontWeight: 800 };
}
function actionBtn(color) {
  return {
    padding: "6px 12px",
    borderRadius: 8,
    background: `${color}15`,
    border: `1px solid ${color}30`,
    color,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    transition: "all .2s",
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

function InfoLine({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span style={{ color: T.textMut, fontSize: 11.5 }}>{label}</span>
      <span
        style={{
          color: strong ? T.text : T.textSub,
          fontSize: 11.5,
          fontWeight: strong ? 900 : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
