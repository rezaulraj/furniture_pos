import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input, Select } from "../../components/Input";
import { Badge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function ExpenseReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ summary: {}, expenses: [], categoryWise: {} });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadData = async () => {
    try {
      const params = { page, limit: 10, startDate: dateFrom, endDate: dateTo };
      if (categoryFilter !== "all") params.category = categoryFilter;
      const res = await fetchReport("expenses", params);
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData({ summary: res?.summary || {}, expenses: res?.expenses || [], categoryWise: res?.categoryWise || {} });
        setPagination(res?.meta || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, categoryFilter, page]);

  const stats = useMemo(() => {
    const s = data.summary || {};
    const count = s.count || 0;
    const total = s.totalAmount || 0;
    const avg = count > 0 ? total / count : 0;
    
    const byCategory = data.categoryWise || {};
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return { total, count, avg, topCategory };
  }, [data]);

  const categories = useMemo(() => {
    const cats = Object.keys(data.categoryWise || {});
    return cats.map(cat => ({ value: cat, label: cat }));
  }, [data.categoryWise]);

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
          <Select label={t("category")} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} options={[{ value: "all", label: t("allCategories") }, ...categories]} />
        </div>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
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
            ) : data.expenses.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              data.expenses.map(e => (
                <tr key={e.expense_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(e.expense_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px" }}><Badge color="purple" small>{e.category || e.expense_type || "General"}</Badge></td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{e.description || e.expense_type}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub }}>{e.store?.store_name || t("general")}</td>
                  <td style={{ padding: "12px 15px", color: T.red, fontWeight: 700 }}>{money(e.amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.textMut, fontSize: 11 }}>{e.payments?.[0]?.bank_reference_no || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />
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
