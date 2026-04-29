import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input } from "../../components/Input";
import { StatusBadge } from "../../components/Badge";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function DailySalesReport() {
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ summary: {}, sales: [] });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetchReport("sales/daily", { date });
      setData(res || { summary: {}, sales: [] });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const stats = data.summary || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>Daily Sales Report</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>Sales summary for {new Date(date).toLocaleDateString()}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> Print Report</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Total Revenue" value={money(stats.totalAmount)} icon="💰" color={T.green} />
        <StatCard label="Total Received" value={money(stats.totalPaid)} icon="📥" color={T.blue} />
        <StatCard label="Total Due" value={money(stats.totalDue)} icon="⏳" color={T.red} />
        <StatCard label="Total Invoices" value={data.sales?.length || 0} icon="🧾" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Input label="Select Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {["Invoice", "Time", "Customer", "Amount", "Paid", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>Loading...</td></tr>
            ) : !data.sales || data.sales.length === 0 ? (
               <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: T.textSub }}>No sales found for this date</td></tr>
            ) : (
              data.sales.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{s.invoice_number}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(s.sale_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{s.customer?.full_name || "Walk-in"}</td>
                  <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(s.total_amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.green }}>{money(s.paid_amount)}</td>
                  <td style={{ padding: "12px 15px" }}><StatusBadge status={s.payment_status} /></td>
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
