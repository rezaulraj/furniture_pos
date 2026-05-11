import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input } from "../../components/Input";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function CashFlowReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ summary: {}, details: {} });
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetchReport("cash-flow", { startDate: dateFrom, endDate: dateTo });
      setData(res || { summary: {}, details: {} });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  const stats = data.summary || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("cashFlowAnalysis")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("monitorCashInflowOutflow")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatCard label={t("totalCashIn")} value={money(stats.totalCashIn)} icon="📥" color={T.green} />
        <StatCard label={t("totalCashOut")} value={money(stats.totalCashOut)} icon="📤" color={T.red} />
        <StatCard label={t("netCashFlow")} value={money(stats.netCashFlow)} icon="⚖️" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ ...card(), padding: 20 }}>
            <h3 style={{ color: T.text, marginTop: 0 }}>{t("inflowDetails")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textSub }}>{t("salePayments")}</span>
                    <span style={{ color: T.text, fontWeight: 700 }}>{money(data.details?.salePayments?.reduce((a, b) => a + Number(b.amount), 0))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textSub }}>{t("installmentPayments")}</span>
                    <span style={{ color: T.text, fontWeight: 700 }}>{money(data.details?.installmentPayments?.reduce((a, b) => a + Number(b.amount), 0))}</span>
                </div>
            </div>
        </div>
        <div style={{ ...card(), padding: 20 }}>
            <h3 style={{ color: T.text, marginTop: 0 }}>{t("outflowDetails")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textSub }}>{t("purchasePayments")}</span>
                    <span style={{ color: T.text, fontWeight: 700 }}>{money(data.details?.purchasePayments?.reduce((a, b) => a + Number(b.amount), 0))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textSub }}>{t("expensePayments")}</span>
                    <span style={{ color: T.text, fontWeight: 700 }}>{money(data.details?.expensePayments?.reduce((a, b) => a + Number(b.amount), 0))}</span>
                </div>
            </div>
        </div>
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
