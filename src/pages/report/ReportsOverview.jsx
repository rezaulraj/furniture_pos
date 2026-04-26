import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useNavigate } from "react-router-dom";

export default function ReportsOverview() {
  const navigate = useNavigate();
  const reports = [
    { title: "Sales Report", icon: <Ic.Cash />, desc: "Detailed analysis of sales and revenue", path: "/reports/sales" },
    { title: "Purchase Report", icon: <Ic.ShoppingCart />, desc: "Track all stock purchases and supplier payments", path: "/reports/purchase" },
    { title: "Inventory Report", icon: <Ic.Package />, desc: "Current stock levels and valuation", path: "/reports/inventory" },
    { title: "Expense Report", icon: <Ic.Eye />, desc: "Categorized business expenses", path: "/reports/expenses" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: T.text, margin: 0 }}>Reports & Analytics</h1>
        <p style={{ color: T.textSub, margin: "5px 0 0" }}>View and export system data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {reports.map((r, i) => (
          <div 
            key={i} 
            style={{ 
              ...card(), 
              padding: 24, 
              cursor: "pointer", 
              transition: "all .2s ease",
            }} 
            onClick={() => navigate(r.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
              e.currentTarget.style.borderColor = T.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent-light)", color: "var(--accent)", display: "grid", placeItems: "center", fontSize: 24, marginBottom: 15 }}>
              {r.icon}
            </div>
            <h3 style={{ color: T.text, margin: "0 0 8px" }}>{r.title}</h3>
            <p style={{ color: T.textSub, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
