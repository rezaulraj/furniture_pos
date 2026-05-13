import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input } from "../../components/Input";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function RefundReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ summary: {}, salesReturns: [], purchaseReturns: [] });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetchReport("refunds", { startDate: dateFrom, endDate: dateTo, page, limit: 10 });
      // The new response structure is { data: { summary, salesReturns, purchaseReturns }, meta }
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData({ summary: {}, salesReturns: [], purchaseReturns: [] });
        setPagination(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, page]);

  const stats = data.summary || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("refundsReturnsReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("trackSalesPurchaseReturns")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <StatCard label={t("totalSalesRefunds")} value={money(stats.totalSalesRefundAmount)} icon="↩️" color={T.red} />
        <StatCard label={t("totalPurchaseRefunds")} value={money(stats.totalPurchaseRefundAmount)} icon="↪️" color={T.green} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h2 style={{ color: T.text, fontSize: 16, margin: 0 }}>{t("salesReturns")}</h2>
        <div style={{ ...card(), overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: T.bg2 }}>
                <tr>
                {[t("date"), t("invoice"), t("customer"), t("product"), t("refund")].map(h => (
                    <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
                ) : data.salesReturns?.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noSalesReturnsFound")}</td></tr>
                ) : (
                data.salesReturns?.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(r.return_date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{r.sale?.invoice_number}</td>
                    <td style={{ padding: "12px 15px", color: T.text }}>{r.sale?.customer?.full_name || t("walkIn")}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{r.product?.product_name}</td>
                    <td style={{ padding: "12px 15px", color: T.red, fontWeight: 700 }}>{money(r.refund_amount)}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        <h2 style={{ color: T.text, fontSize: 16, margin: "20px 0 0" }}>{t("purchaseReturns")}</h2>
        <div style={{ ...card(), overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: T.bg2 }}>
                <tr>
                {[t("date"), t("reference"), t("supplier"), t("product"), t("refund")].map(h => (
                    <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
                ) : data.purchaseReturns?.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noPurchaseReturnsFound")}</td></tr>
                ) : (
                data.purchaseReturns?.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(r.return_date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{r.purchase?.purchase_reference}</td>
                    <td style={{ padding: "12px 15px", color: T.text }}>{r.purchase?.supplier?.supplier_name}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{r.product?.product_name}</td>
                    <td style={{ padding: "12px 15px", color: T.green, fontWeight: 700 }}>{money(r.refund_amount)}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
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
