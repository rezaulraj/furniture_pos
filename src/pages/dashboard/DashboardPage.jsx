import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { SALE_HISTORY } from "../../data/sampleData";

export default function DashboardPage({ onNav }) {
  const KPI = [
    {
      label: "Total Revenue",
      value: "৳8,42,500",
      delta: "+18.4%",
      up: true,
      color: T.green,
      icon: <Ic.TrendUp />,
    },
    {
      label: "Total Purchases",
      value: "৳4,21,200",
      delta: "-5.2%",
      up: false,
      color: T.blue,
      icon: <Ic.Receipt />,
    },
    {
      label: "Net Profit",
      value: "৳2,18,300",
      delta: "+9.1%",
      up: true,
      color: T.amber,
      icon: <Ic.TrendUp />,
    },
    {
      label: "Active Customers",
      value: "1,248",
      delta: "+34 new",
      up: true,
      color: T.purple,
      icon: <Ic.User />,
    },
    {
      label: "Pending Dues",
      value: "৳1,08,750",
      delta: "12 overdue",
      up: false,
      color: T.red,
      icon: <Ic.Alert />,
    },
    {
      label: "Stock Value",
      value: "৳18,74,200",
      delta: "+2.3%",
      up: true,
      color: "#22d3ee",
      icon: <Ic.Package />,
    },
  ];

  const topProducts = [
    { name: "Teak Wood Sofa", sales: 48, revenue: "৳13.7L", trend: true },
    { name: "Oak Dining Table", sales: 31, revenue: "৳13.0L", trend: true },
    { name: "Walnut Double Bed", sales: 27, revenue: "৳9.5L", trend: true },
    { name: "Rattan Armchair", sales: 64, revenue: "৳6.3L", trend: false },
    { name: "Mahogany Coffee Table", sales: 41, revenue: "৳6.2L", trend: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          ...card(),
          padding: "20px 24px",
          background:
            "linear-gradient(135deg,#1e1208 0%,#2d1a08 60%,#1a0d05 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", right: -20, top: -20, opacity: 0.04 }}
        >
          <svg
            width={200}
            height={200}
            viewBox="0 0 24 24"
            fill={T.gold}
            stroke="none"
          >
            <rect x="3" y="8" width="18" height="4" rx="1" />
            <path d="M5 12v7h14v-7M8 19v-4h8v4M3 8l2-4h14l2 4" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div>
            <p
              style={{
                color: T.textMut,
                fontSize: 11,
                margin: 0,
                letterSpacing: "0.06em",
              }}
            >
              GOOD MORNING
            </p>
            <h2
              style={{
                color: T.text,
                fontSize: 22,
                fontWeight: 900,
                margin: "4px 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, Admin 👋
            </h2>
            <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
              WoodCraft Furniture — Main Store • Saturday, April 04, 2026
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => onNav("sales/new")}>
              <Ic.Sale /> New Sale
            </Btn>
            <Btn variant="ghost">
              <Ic.Receipt /> View Reports
            </Btn>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {KPI.map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "16px 18px",
              cursor: "pointer",
              transition: "all .2s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "50";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -8,
                top: -8,
                opacity: 0.07,
                color: k.color,
              }}
            >
              <svg
                width={80}
                height={80}
                viewBox="0 0 18 18"
                fill={k.color}
                stroke="none"
              >
                <circle cx={9} cy={9} r={9} />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    margin: 0,
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  {k.label.toUpperCase()}
                </p>
                <p
                  style={{
                    color: T.text,
                    fontSize: 22,
                    fontWeight: 900,
                    margin: "4px 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {k.value}
                </p>
                <Badge color={k.up ? "green" : "red"} small>
                  {k.delta}
                </Badge>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: k.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: k.color,
                }}
              >
                {k.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}
      >
        <div style={{ ...card(), padding: "16px 18px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <h3
              style={{
                color: T.text,
                fontWeight: 700,
                fontSize: 13,
                margin: 0,
              }}
            >
              Recent Sales
            </h3>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => onNav("sales/history")}
            >
              View All
            </Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Invoice", "Customer", "Amount", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        color: T.textMut,
                        fontSize: 9.5,
                        fontWeight: 600,
                        textAlign: "left",
                        padding: "0 8px 8px",
                        letterSpacing: "0.07em",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {SALE_HISTORY.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td
                    style={{
                      padding: "8px",
                      color: T.gold,
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {s.inv}
                  </td>
                  <td style={{ padding: "8px", color: T.text, fontSize: 11.5 }}>
                    {s.customer}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      color: T.text,
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    ৳{s.total.toLocaleString()}
                  </td>
                  <td style={{ padding: "8px" }}>
                    <StatusBadge status={s.status} />
                  </td>
                  <td
                    style={{ padding: "8px", color: T.textSub, fontSize: 11 }}
                  >
                    {s.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...card(), padding: "16px 18px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <h3
              style={{
                color: T.text,
                fontWeight: 700,
                fontSize: 13,
                margin: 0,
              }}
            >
              Top Products
            </h3>
            <Badge color="gold" small>
              This Month
            </Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {topProducts.map((p, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    color: T.textMut,
                    fontSize: 10,
                    fontWeight: 700,
                    width: 14,
                  }}
                >
                  #{i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{ color: T.text, fontSize: 11.5, fontWeight: 600 }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{ color: T.gold, fontSize: 11, fontWeight: 700 }}
                    >
                      {p.revenue}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 3,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background: "rgba(139,90,43,0.15)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(p.sales / 70) * 100}%`,
                          height: "100%",
                          background: `linear-gradient(90deg,${T.gold},${T.amber})`,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span style={{ color: T.textSub, fontSize: 10 }}>
                      {p.sales} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Sales Report",
            sub: "Full analytics & trends",
            icon: <Ic.Receipt />,
            color: T.green,
            nav: "reports/sales",
          },
          {
            label: "Stock Alerts",
            sub: "7 items critically low",
            icon: <Ic.Alert />,
            color: T.yellow,
            nav: "inventory/low-stock",
          },
          {
            label: "Pending Dues",
            sub: "৳1.08L outstanding",
            icon: <Ic.Cash />,
            color: T.red,
            nav: "sales/installments",
          },
          {
            label: "New Purchase",
            sub: "Restock inventory",
            icon: <Ic.Package />,
            color: T.blue,
            nav: "purchases/new",
          },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "14px 16px",
              cursor: "pointer",
              transition: "all .2s",
            }}
            onClick={() => onNav(r.nav)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = r.color + "50";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: r.color + "18",
                color: r.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              {r.icon}
            </div>
            <p
              style={{
                color: T.text,
                fontWeight: 700,
                fontSize: 12.5,
                margin: "0 0 2px",
              }}
            >
              {r.label}
            </p>
            <p style={{ color: T.textSub, fontSize: 10.5, margin: 0 }}>
              {r.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
