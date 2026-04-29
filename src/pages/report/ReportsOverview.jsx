import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useNavigate } from "react-router-dom";

export default function ReportsOverview() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Sales & Revenue",
      reports: [
        { title: "General Sales", icon: <Ic.Cash />, desc: "Overall sales performance and invoices", path: "/reports/sales" },
        { title: "Daily Sales", icon: <Ic.CalendarIcon />, desc: "Summary of sales for a specific day", path: "/reports/sales/daily" },
        { title: "Product-wise Sales", icon: <Ic.Package />, desc: "Analyze which products are selling most", path: "/reports/sales/product" },
        { title: "Customer-wise Sales", icon: <Ic.Users />, desc: "Sales data aggregated by customer", path: "/reports/sales/customer" },
        { title: "Sales Profit/Loss", icon: <Ic.TrendUp />, desc: "Profit margins on each sale", path: "/reports/sales/profit" },
        { title: "Refunds/Returns", icon: <Ic.RefreshCw />, desc: "Track sales and purchase returns", path: "/reports/refunds" },
      ]
    },
    {
      name: "Purchases & Suppliers",
      reports: [
        { title: "Purchase Report", icon: <Ic.ShoppingCart />, desc: "Track all stock purchases", path: "/reports/purchase" },
        { title: "Item-wise Purchase", icon: <Ic.Package />, desc: "Purchases grouped by products", path: "/reports/purchases/items" },
        { title: "Supplier Report", icon: <Ic.User />, desc: "Overview of all suppliers and dues", path: "/reports/suppliers" },
        { title: "Supplier Item Analysis", icon: <Ic.Package />, desc: "Products sourced from specific suppliers", path: "/reports/suppliers/items" },
        { title: "Supplier Profitability", icon: <Ic.Cash />, desc: "Profit analysis by supplier sourcing", path: "/reports/suppliers/profit-loss" },
      ]
    },
    {
      name: "Finance & Expenses",
      reports: [
        { title: "Cash Flow", icon: <Ic.TrendUp />, desc: "Monitor cash inflows and outflows", path: "/reports/cash-flow" },
        { title: "Bank Payments", icon: <Ic.Card />, desc: "Report of all bank-based transactions", path: "/reports/payments/bank" },
        { title: "Expense Report", icon: <Ic.Eye />, desc: "Categorized business expenses", path: "/reports/expenses" },
        { title: "Inventory Valuation", icon: <Ic.Package />, desc: "Current stock levels and valuation", path: "/reports/inventory" },
      ]
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>
      <div>
        <h1 style={{ color: T.text, margin: 0 }}>Reports & Analytics</h1>
        <p style={{ color: T.textSub, margin: "5px 0 0" }}>Comprehensive data analysis for your business</p>
      </div>

      {categories.map((cat, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ color: T.text, fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${T.border}`, paddingBottom: 8 }}>
            {cat.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {cat.reports.map((r, i) => (
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
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(var(--accent-rgb, 124, 58, 237), 0.1)", color: T.accent, display: "grid", placeItems: "center", fontSize: 24, marginBottom: 15 }}>
                  {r.icon}
                </div>
                <h3 style={{ color: T.text, margin: "0 0 8px", fontSize: 15 }}>{r.title}</h3>
                <p style={{ color: T.textSub, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
