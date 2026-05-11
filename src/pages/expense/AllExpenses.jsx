import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
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
    isLoading,
    error,
    fetchExpenses,
    updateExpenseStatus,
    clearError,
  } = useExpenseStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchExpenses();
    clearError?.();
  }, [fetchExpenses, clearError]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        e.expense_title?.toLowerCase().includes(q) ||
        e.store?.store_name?.toLowerCase().includes(q) ||
        e.category?.category_name?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [expenses, search, statusFilter]);

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
            { value: "paid", label: t("paid") },
            { value: "cancelled", label: t("cancelled") },
          ]}
        />
        <Btn onClick={() => (window.location.href = "/expenses/add")}>
          <Ic.Plus /> {t("addExpense")}
        </Btn>
      </div>

      {error && <div style={{ color: T.red, fontWeight: 700 }}>{error}</div>}

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("date"), t("title"), t("category"), t("store"), t("amount"), t("method"), t("status"), t("action")].map((h) => (
                <th key={h} style={thStyle()}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center" }}>{t("loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center" }}>{t("noExpensesFound")}</td></tr>
            ) : (
              filtered.map((exp) => (
                <tr key={exp.expense_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={tdStyle()}>{new Date(exp.expense_date).toLocaleDateString()}</td>
                  <td style={tdStyle()}>
                    <span style={{ fontWeight: 700, color: T.text }}>{exp.expense_title}</span>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: T.textMut }}>{exp.expense_code}</p>
                  </td>
                  <td style={tdStyle()}>{exp.category?.category_name}</td>
                  <td style={tdStyle()}>{exp.store?.store_name}</td>
                  <td style={tdStrongStyle(T.text)}>{money(exp.amount)}</td>
                  <td style={tdStyle()}>{exp.payment_method}</td>
                  <td style={tdStyle()}><StatusBadge status={exp.status} /></td>
                  <td style={tdStyle()}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {exp.status === "pending" && (
                        <button onClick={() => handleStatusUpdate(exp.expense_id, "approved")} style={actionBtn(T.blue)}>{t("approve")}</button>
                      )}
                      {exp.status === "approved" && (
                        <button onClick={() => handleStatusUpdate(exp.expense_id, "paid")} style={actionBtn(T.green)}>{t("markPaid")}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
  return { padding: "12px 10px", color: T.textMut, fontSize: 9, fontWeight: 800, textAlign: "left", borderBottom: `1px solid ${T.border}` };
}
function tdStyle() {
  return { padding: "12px 10px", fontSize: 12, color: T.textSub };
}
function tdStrongStyle(color) {
  return { ...tdStyle(), color, fontWeight: 800 };
}
function actionBtn(color) {
  return { padding: "4px 8px", borderRadius: 6, background: `${color}15`, border: `1px solid ${color}30`, color, cursor: "pointer", fontSize: 10, fontWeight: 700 };
}
