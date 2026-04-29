import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { useSupplierStore } from "../../store/supplierStore";
import { Input, Select } from "../../components/Input";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function SupplierProfitLossReport() {
  const { fetchReport, isLoading } = useReportStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [data, setData] = useState({ summary: {}, details: [] });
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
        endDate: dateTo
      });
      setData(res || { summary: {}, details: [] });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if(supplierId) loadData();
  }, [supplierId, dateFrom, dateTo]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>Supplier Profitability Analysis</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>Profit margins on products sourced from specific suppliers</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> Print Report</Btn>
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
            <Select 
                label="Supplier" 
                value={supplierId} 
                onChange={e => setSupplierId(e.target.value)} 
                options={[
                    { value: "", label: "Select Supplier" },
                    ...suppliers.map(s => ({ value: String(s.supplier_id), label: s.supplier_name }))
                ]} 
            />
        </div>
        <Input label="From" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label="To" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      {!supplierId ? (
          <div style={{ ...card(), padding: 40, textAlign: "center", color: T.textSub }}>
              Please select a supplier to view the report
          </div>
      ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 16 }}>
                <StatCard label="Total Net Profit" value={money(data.summary?.totalProfit)} icon="📈" color={T.accent} />
            </div>

            <div style={{ ...card(), overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: T.bg2 }}>
                    <tr>
                    {["Product Name", "Qty Sold", "Revenue", "Cost", "Profit"].map(h => (
                        <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>Loading...</td></tr>
                    ) : !data.details || data.details.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>No sales found for products from this supplier</td></tr>
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
