import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { card, T } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useDashboardStore } from "../../store/dashboardStore";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

const statusColor = (s) =>
  s === "paid"
    ? "green"
    : s === "partial"
      ? "yellow"
      : s === "pending"
        ? "blue"
        : "red";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t, lang } = useLanguageStore();
  const { summary, isLoading, error, fetchDashboardSummary } =
    useDashboardStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  const revenue = Number(summary?.revenue || 0);
  const purchases = Number(summary?.purchases_total || 0);
  const expenses = Number(summary?.expenses_total || 0);
  const profit = revenue - purchases - expenses;

  const KPI = [
    {
      label: t("totalRevenue"),
      value: money(summary?.revenue),
      sub: `${summary?.sales_count || 0} ${t("sales")}`,
      color: T.green,
      icon: <Ic.TrendUp />,
    },
    {
      label: t("totalPurchases"),
      value: money(summary?.purchases_total),
      sub: t("cost"),
      color: T.blue,
      icon: <Ic.Receipt />,
    },
    {
      label: t("netProfit"),
      value: money(profit),
      sub: t("revenuePurchaseExpenseProfitComparison"),
      color: T.accent,
      icon: <Ic.TrendUp />,
    },
    {
      label: t("paidRevenue"),
      value: money(summary?.paid_revenue),
      sub: t("collectedAmount"),
      color: T.green,
      icon: <Ic.Cash />,
    },
    {
      label: t("pendingDues"),
      value: money(summary?.due_revenue),
      sub: t("customerDue"),
      color: T.red,
      icon: <Ic.Alert />,
    },
    {
      label: t("products"),
      value: Number(summary?.product_count || 0).toLocaleString(),
      sub: `${summary?.low_stock_alerts || 0} ${t("lowStock")}`,
      color: T.yellow,
      icon: <Ic.Package />,
    },
  ];

  const chartData = [
    { label: t("revenue"), value: revenue, color: T.green },
    { label: t("purchases"), value: purchases, color: T.blue },
    { label: t("expenses"), value: expenses, color: T.red },
    { label: t("profit"), value: Math.max(0, profit), color: T.accent },
  ];

  const maxChart = Math.max(...chartData.map((x) => x.value), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          ...card(),
          padding: "20px 24px",
          background:
            "background: linear-gradient(135deg, rgba(172,82,8,.18), rgba(4,13,28,.88)), #ffffff;",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", right: -40, top: -40, opacity: 0.08 }}
        >
          <Ic.Sofa />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            gap: 16,
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
              {t("dashboardOverview")}
            </p>

            <h2
              style={{
                color: T.text,
                fontSize: 23,
                fontWeight: 900,
                margin: "4px 0 6px",
              }}
            >
              {t("welcomeBack")} {user?.full_name || user?.username || "Admin"} 👋
            </h2>

            <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
              {user?.store?.store_name || "Furniture Shop"} • {t("liveBusinessSummary")}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => navigate("/sales/new")}>
              <Ic.Sale /> {t("newSale")}
            </Btn>

            <Btn variant="ghost" onClick={() => fetchDashboardSummary()}>
              {t("refresh")}
            </Btn>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
            fontWeight: 800,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {KPI.map((k) => (
          <div
            key={k.label}
            style={{
              ...card(),
              padding: "16px 18px",
              position: "relative",
              overflow: "hidden",
              opacity: isLoading ? 0.65 : 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -8,
                top: -8,
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: `${k.color}15`,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    margin: 0,
                    letterSpacing: "0.06em",
                    fontWeight: 800,
                  }}
                >
                  {k.label.toUpperCase()}
                </p>

                <p
                  style={{
                    color: T.text,
                    fontSize: 22,
                    fontWeight: 900,
                    margin: "5px 0 4px",
                  }}
                >
                  {isLoading ? t("loading") : k.value}
                </p>

                <p style={{ color: T.textMut, fontSize: 11, margin: 0 }}>
                  {k.sub}
                </p>
              </div>

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${k.color}18`,
                  display: "grid",
                  placeItems: "center",
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
        style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14 }}
      >
        <div style={{ ...card(), padding: "18px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <h3 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
                {t("financialSnapshot")}
              </h3>
              <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
                {t("revenuePurchaseExpenseProfitComparison")}
              </p>
            </div>

            <Badge color={profit >= 0 ? "green" : "red"} small>
              {profit >= 0 ? t("profit").toUpperCase() : t("loss").toUpperCase()}
            </Badge>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {chartData.map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: T.textSub, fontWeight: 800 }}>
                    {item.label}
                  </span>
                  <span style={{ color: item.color, fontWeight: 900 }}>
                    {money(item.value)}
                  </span>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: T.bg2,
                    overflow: "hidden",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      width: `${(item.value / maxChart) * 100}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card(), padding: "18px 20px" }}>
          <h3 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            {t("quickActions")}
          </h3>
          <p style={{ color: T.textSub, fontSize: 12, margin: "4px 0 14px" }}>
            {t("frequentlyUsedOperations")}
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                label: t("newSale"),
                sub: t("createPosInvoice"),
                icon: <Ic.Sale />,
                color: T.green,
                nav: "/sales/new",
              },
              {
                label: t("lowStockAlert"),
                sub: `${summary?.low_stock_alerts || 0} ${t("itemsNeedAttention")}`,
                icon: <Ic.Alert />,
                color: T.yellow,
                nav: "/inventory/low-stock",
              },
              {
                label: t("purchase"),
                sub: t("receiveNewStock"),
                icon: <Ic.Package />,
                color: T.blue,
                nav: "/purchases/new",
              },
              {
                label: t("saleHistory"),
                sub: t("viewReportsInvoices"),
                icon: <Ic.Receipt />,
                color: T.accent,
                nav: "/sales/history",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.nav)}
                style={{
                  width: "100%",
                  ...card(),
                  padding: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${item.color}18`,
                    color: item.color,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {item.icon}
                </span>

                <span style={{ flex: 1 }}>
                  <b
                    style={{ color: T.text, display: "block", fontSize: 12.5 }}
                  >
                    {item.label}
                  </b>
                  <span style={{ color: T.textSub, fontSize: 11 }}>
                    {item.sub}
                  </span>
                </span>

                <span style={{ color: T.textMut }}>
                  <Ic.ChevRight />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...card(), padding: "16px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h3
            style={{ color: T.text, fontWeight: 900, fontSize: 14, margin: 0 }}
          >
            {t("recentSales")}
          </h3>

          <Btn
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sales/history")}
          >
            {t("viewAll")}
          </Btn>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                t("invoice"),
                t("customer"),
                t("amount"),
                t("paid"),
                t("due"),
                t("status"),
                t("date"),
              ].map((h) => (
                <th key={h} style={th()}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={emptyTd()}>
                  {t("loadingRecentSales")}
                </td>
              </tr>
            ) : !summary?.recent_sales?.length ? (
              <tr>
                <td colSpan={7} style={emptyTd()}>
                  {t("noData")}
                </td>
              </tr>
            ) : (
              summary.recent_sales.map((sale) => (
                <tr
                  key={sale.sale_id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td style={tdAccent()}>{sale.invoice_number}</td>
                  <td style={td()}>
                    {sale.customer?.full_name || t("walkInCustomer")}
                  </td>
                  <td style={tdStrong(T.text)}>{money(sale.total_amount)}</td>
                  <td style={tdStrong(T.green)}>{money(sale.paid_amount)}</td>
                  <td
                    style={tdStrong(
                      Number(sale.due_amount) > 0 ? T.red : T.textMut,
                    )}
                  >
                    {money(sale.due_amount)}
                  </td>
                  <td style={td()}>
                    <Badge color={statusColor(sale.payment_status)} small>
                      {sale.payment_status?.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={td()}>
                    {sale.sale_date
                      ? new Date(sale.sale_date).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function th() {
  return {
    color: T.textMut,
    fontSize: 10,
    fontWeight: 900,
    textAlign: "left",
    padding: "0 8px 10px",
    letterSpacing: "0.07em",
    borderBottom: `1px solid ${T.border}`,
  };
}

function td() {
  return {
    padding: "10px 8px",
    color: T.textSub,
    fontSize: 12,
  };
}

function tdAccent() {
  return {
    ...td(),
    color: T.accent,
    fontWeight: 900,
    fontFamily: "monospace",
  };
}

function tdStrong(color) {
  return {
    ...td(),
    color,
    fontWeight: 900,
  };
}

function emptyTd() {
  return {
    padding: 34,
    textAlign: "center",
    color: T.textSub,
    fontSize: 12,
  };
}
