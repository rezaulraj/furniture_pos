import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input } from "../../components/Input";
import { Badge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function ProfitLossReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ summary: {}, details: [] });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetchReport("sales/profit", { startDate: dateFrom, endDate: dateTo, page, limit: 10 });
      if (res && res.data) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData({ summary: res?.summary || {}, details: res?.details || [] });
        setPagination(res?.meta || null);
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
          <h1 style={{ color: T.text, margin: 0 }}>{t("salesProfitLoss")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("detailedProfitAnalysisSale")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label={t("totalRevenue")} value={money(stats.totalRevenue)} icon="💰" color={T.green} />
        <StatCard label={t("totalCost")} value={money(stats.totalCost)} icon="📉" color={T.red} />
        <StatCard label={t("totalProfit")} value={money(stats.totalProfit)} icon="📈" color={T.accent} />
        <StatCard label={t("avgMargin")} value={`${Number(stats.averageMargin || 0).toFixed(2)}%`} icon="📊" color={T.blue} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("invoice"), t("date"), t("revenue"), t("cost"), t("profit"), t("margin")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : !data.details || data.details.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              data.details.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{item.invoice_number}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(item.sale_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{money(item.revenue)}</td>
                  <td style={{ padding: "12px 15px", color: T.red }}>{money(item.cost)}</td>
                  <td style={{ padding: "12px 15px", color: T.green, fontWeight: 700 }}>{money(item.profit)}</td>
                  <td style={{ padding: "12px 15px" }}>
                    <Badge color={item.margin > 20 ? T.green : item.margin > 10 ? T.blue : T.red}>
                      {Number(item.margin || 0).toFixed(1)}%
                    </Badge>
                  </td>
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
