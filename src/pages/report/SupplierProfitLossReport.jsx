import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { useSupplierStore } from "../../store/supplierStore";
import { Input, Select } from "../../components/Input";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function SupplierProfitLossReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [data, setData] = useState({ summary: {}, details: [] });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [supplierId, setSupplierId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const loadData = async () => {
    if (!supplierId) return;
    try {
      const res = await fetchReport("suppliers/profit-loss", { 
        supplier_id: supplierId,
        startDate: dateFrom,
        endDate: dateTo,
        page,
        limit: 10
      });
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData(res || { summary: {}, details: [] });
        setPagination(res?.meta || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if(supplierId) loadData();
  }, [supplierId, dateFrom, dateTo, page]);

  const handleSupplierChange = (val) => {
    setSupplierId(val);
    setPage(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("supplierProfitabilityAnalysis")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("profitMarginsProductsSourcedSuppliers")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
            <Select 
                label={t("supplier")} 
                value={supplierId} 
                onChange={e => handleSupplierChange(e.target.value)} 
                options={[
                    { value: "", label: t("selectSupplier") },
                    ...suppliers.map(s => ({ value: String(s.supplier_id), label: s.supplier_name }))
                ]} 
            />
        </div>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      {!supplierId ? (
          <div style={{ ...card(), padding: 40, textAlign: "center", color: T.textSub }}>
              {t("pleaseSelectSupplierReport")}
          </div>
      ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 16 }}>
                <StatCard label={t("totalNetProfit")} value={money(data.summary?.totalProfit)} icon="📈" color={T.accent} />
            </div>

            <div style={{ ...card(), overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: T.bg2 }}>
                    <tr>
                    {[t("productName"), t("qtySold"), t("revenue"), t("cost"), t("profit")].map(h => (
                        <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
                    ) : !data.details || data.details.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noSalesFoundSupplierProducts")}</td></tr>
                    ) : (
                    data.details.map((item, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "12px 15px", color: T.text, fontWeight: 600 }}>{item.product_name}</td>
                        <td style={{ padding: "12px 15px", color: T.textSub }}>{item.total_quantity}</td>
                        <td style={{ padding: "12px 15px", color: T.text }}>{money(item.total_revenue)}</td>
                        <td style={{ padding: "12px 15px", color: T.red }}>{money(item.total_cost)}</td>
                        <td style={{ padding: "12px 15px", color: T.green, fontWeight: 700 }}>{money(item.total_profit)}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
            <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />
          </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ ...card(), padding: 20, borderLeft: `4px solid ${color}`, maxWidth: 300 }}>
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

function Btn({ children, variant = "primary", onClick, style }) {
  const isGhost = variant === "ghost";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 10,
        border: isGhost ? `1px solid ${T.border}` : "none",
        background: isGhost ? T.bg3 : T.accent,
        color: isGhost ? T.text : "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style
      }}
    >
      {children}
    </button>
  );
}
