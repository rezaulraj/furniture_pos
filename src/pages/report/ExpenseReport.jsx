import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useExpenseStore } from "../../store/expenseStore";
import { Input, Select } from "../../components/Input";
import { Badge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function ExpenseReport() {
  const { t } = useLanguageStore();
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const eDate = new Date(e.expense_date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      
      const matchDate = (!from || eDate >= from) && (!to || eDate <= new Date(to.setHours(23, 59, 59, 999)));
      const matchCategory = categoryFilter === "all" || e.category === categoryFilter;
      
      return matchDate && matchCategory;
    });
  }, [expenses, dateFrom, dateTo, categoryFilter]);

  const stats = useMemo(() => {
    const total = filtered.reduce((a, b) => a + Number(b.amount || 0), 0);
    const count = filtered.length;
    const avg = count > 0 ? total / count : 0;
    
    const byCategory = filtered.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return { total, count, avg, topCategory };
  }, [filtered]);

  const categories = useMemo(() => {
    const c = new Set(expenses.map(x => x.category));
    return Array.from(c).map(cat => ({ value: cat, label: cat }));
  }, [expenses]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("expenseReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("businessExpenditureAnalysis")}</p>
        </div>
        <button onClick={() => window.print()} style={btnStyle()}><Ic.Print /> {t("print")}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label={t("totalExpenses")} value={money(stats.total)} icon="📉" color={T.red} />
        <StatCard label={t("transactionCount")} value={stats.count} icon="📝" color={T.blue} />
        <StatCard label={t("averageExpense")} value={money(stats.avg)} icon="📊" color={T.green} />
        <StatCard label={t("topCategory")} value={stats.topCategory} icon="🏆" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Select label={t("category")} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={[{ value: "all", label: t("allCategories") }, ...categories]} />
        </div>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("date"), t("category"), t("description"), t("store"), t("amount"), t("reference")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              filtered.map(e => (
                <tr key={e.expense_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(e.expense_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px" }}><Badge color="purple" small>{e.category}</Badge></td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{e.description}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub }}>{e.store?.store_name || t("general")}</td>
                  <td style={{ padding: "12px 15px", color: T.red, fontWeight: 700 }}>{money(e.amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.textMut, fontSize: 11 }}>{e.reference_no || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ ...card(), padding: 20, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: T.textSub, fontSize: 11, fontWeight: 800, margin: 0 }}>{label.toUpperCase()}</p>
          <h2 style={{ color: T.text, margin: "8px 0 0", fontSize: 22, fontWeight: 900 }}>{value}</h2>
        </div>
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
    </div>
  );
}

function btnStyle() {
  return {
    padding: "10px 18px",
    borderRadius: 10,
    border: `1px solid ${T.border}`,
    background: T.bg3,
    color: T.text,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
}
