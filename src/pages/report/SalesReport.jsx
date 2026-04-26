import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useSaleStore } from "../../store/saleStore";
import { Input, Select } from "../../components/Input";
import { Badge, StatusBadge } from "../../components/Badge";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function SalesReport() {
  const { sales, fetchSales, isLoading } = useSaleStore();
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [storeFilter, setStoreFilter] = useState("all");

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const saleDate = new Date(s.sale_date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      
      const matchDate = (!from || saleDate >= from) && (!to || saleDate <= new Date(to.setHours(23, 59, 59, 999)));
      const matchStore = storeFilter === "all" || String(s.store_id) === storeFilter;
      
      return matchDate && matchStore;
    });
  }, [sales, dateFrom, dateTo, storeFilter]);

  const stats = useMemo(() => {
    const total = filtered.reduce((a, b) => a + Number(b.total_amount || 0), 0);
    const paid = filtered.reduce((a, b) => a + Number(b.paid_amount || 0), 0);
    const due = filtered.reduce((a, b) => a + Number(b.due_amount || 0), 0);
    return { total, paid, due, count: filtered.length };
  }, [filtered]);

  const stores = useMemo(() => {
    const s = new Map();
    sales.forEach(x => {
      if(x.store) s.set(x.store_id, x.store.store_name);
    });
    return Array.from(s.entries()).map(([id, name]) => ({ value: String(id), label: name }));
  }, [sales]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>Sales Report</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>Analyze your sales performance</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> Print Report</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Total Revenue" value={money(stats.total)} icon="💰" color={T.green} />
        <StatCard label="Total Received" value={money(stats.paid)} icon="📥" color={T.blue} />
        <StatCard label="Total Outstanding" value={money(stats.due)} icon="⏳" color={T.red} />
        <StatCard label="Total Invoices" value={stats.count} icon="🧾" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Select label="Store" value={storeFilter} onChange={e => setStoreFilter(e.target.value)} options={[{ value: "all", label: "All Stores" }, ...stores]} />
        </div>
        <Input label="From" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label="To" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={() => fetchSales()} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {["Invoice", "Date", "Customer", "Store", "Amount", "Paid", "Due", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: T.textSub }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: T.textSub }}>No records found for this period</td></tr>
            ) : (
              filtered.map(s => (
                <tr key={s.sale_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{s.invoice_number}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(s.sale_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{s.customer?.full_name || "Walk-in"}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub }}>{s.store?.store_name}</td>
                  <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(s.total_amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.green, fontWeight: 700 }}>{money(s.paid_amount)}</td>
                  <td style={{ padding: "12px 15px", color: T.red, fontWeight: 700 }}>{money(s.due_amount)}</td>
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
