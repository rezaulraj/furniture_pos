import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input, Select } from "../../components/Input";
import { StatusBadge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";
import { useBranchStore } from "../../store/branchStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function PurchaseReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const { branches, fetchBranches } = useBranchStore();
  const [data, setData] = useState({ summary: {}, purchases: [] });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [storeFilter, setStoreFilter] = useState("all");

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const loadData = async () => {
    try {
      const params = { page, limit: 10, startDate: dateFrom, endDate: dateTo };
      if (storeFilter !== "all") params.store_id = storeFilter;
      const res = await fetchReport("purchases", params);
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData({ summary: res?.summary || {}, purchases: res?.purchases || [] });
        setPagination(res?.meta || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, storeFilter, page]);

  const stats = data.summary || {};
  const filtered = data.purchases || [];

  const stores = useMemo(() => {
    return branches.map(b => ({ value: String(b.store_id), label: b.store_name }));
  }, [branches]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("purchaseReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("trackStockProcurementSupplierPayments")}</p>
        </div>
        <button onClick={() => window.print()} style={btnStyle()}><Ic.Print /> {t("print")}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label={t("totalPurchases")} value={money(stats.totalAmount)} icon="🛒" color={T.blue} />
        <StatCard label={t("paidToSuppliers")} value={money(stats.totalPaid)} icon="💸" color={T.green} />
        <StatCard label={t("outstandingDebt")} value={money(stats.totalDue)} icon="🛑" color={T.red} />
        <StatCard label={t("totalOrders")} value={stats.count || 0} icon="📦" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Select label={t("store")} value={storeFilter} onChange={e => { setStoreFilter(e.target.value); setPage(1); }} options={[{ value: "all", label: t("allStores") }, ...stores]} />
        </div>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("poNumber"), t("date"), t("supplier"), t("store"), t("amount"), t("paid"), t("due"), t("status")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p.purchase_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{p.purchase_id}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(p.purchase_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{p.supplier?.supplier_name}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub }}>{p.store?.store_name}</td>
                  <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(p.total_amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.green, fontWeight: 700 }}>{money(p.paid_amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.red, fontWeight: 700 }}>{money(p.due_amount)}</td>
                  <td style={{ padding: "12px 15px" }}><StatusBadge status={p.payment_status} /></td>
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
