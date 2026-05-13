import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Select } from "../../components/Input";
import { Badge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

import { useBranchStore } from "../../store/branchStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function InventoryReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const { branches, fetchBranches } = useBranchStore();
  const [data, setData] = useState({ summary: {}, inventory: [] });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [storeFilter, setStoreFilter] = useState("all");

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const loadData = async () => {
    try {
      const params = { page, limit: 10 };
      if (storeFilter !== "all") params.store_id = storeFilter;
      const res = await fetchReport("inventory", params);
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData({ summary: res?.summary || {}, inventory: res?.inventory || [] });
        setPagination(res?.meta || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [storeFilter, page]);

  const stats = data.summary || {};
  const filtered = data.inventory || [];

  const stores = useMemo(() => {
    return branches.map(b => ({ value: String(b.store_id), label: b.store_name }));
  }, [branches]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("inventoryReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("stockLevelsAssetValuation")}</p>
        </div>
        <button onClick={() => window.print()} style={btnStyle()}><Ic.Print /> {t("print")}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label={t("totalStock")} value={stats.totalItems || 0} icon="📦" color={T.blue} />
        <StatCard label={t("stockValue")} value={money(stats.valuation)} icon="💎" color={T.green} />
        <StatCard label={t("lowStockItems")} value={stats.lowStockCount || 0} icon="⚠️" color={T.red} />
        <StatCard label={t("productTypes")} value={stats.productTypes || 0} icon="🏷️" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ width: 300 }}>
          <Select label={t("filterByStore")} value={storeFilter} onChange={e => { setStoreFilter(e.target.value); setPage(1); }} options={[{ value: "all", label: t("allStores") }, ...stores]} />
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={loadData} style={btnStyle()}><Ic.RefreshCw /> {t("refresh")}</button>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("product"), t("sku"), t("store"), t("currentStock"), t("unitPrice"), t("totalValue"), t("status")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              filtered.map(item => {
                const prod = item.product;
                const isLow = Number(item.quantity) <= Number(prod?.min_stock_level || 5);
                return (
                  <tr key={item.inventory_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{prod?.product_name || t("unknownProduct")}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{prod?.sku || "—"}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{item.store?.store_name}</td>
                    <td style={{ padding: "12px 15px", color: isLow ? T.red : T.text, fontWeight: 900 }}>{item.quantity}</td>
                    <td style={{ padding: "12px 15px", color: T.textMut }}>{money(prod?.purchase_price)}</td>
                    <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(item.quantity * (prod?.purchase_price || 0))}</td>
                    <td style={{ padding: "12px 15px" }}>
                      <Badge color={isLow ? "red" : "green"}>{isLow ? t("lowStock") : t("inStock")}</Badge>
                    </td>
                  </tr>
                );
              })
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
