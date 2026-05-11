import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../store/languageStore";

export default function ReportsOverview() {
  const navigate = useNavigate();
  const { t } = useLanguageStore();

  const categories = [
    {
      name: t("salesRevenue"),
      reports: [
        { title: t("generalSales"), icon: <Ic.Cash />, desc: t("overallSalesPerformance"), path: "/reports/sales" },
        { title: t("dailySales"), icon: <Ic.CalendarIcon />, desc: t("summaryOfSalesSpecificDay"), path: "/reports/sales/daily" },
        { title: t("productWiseSales"), icon: <Ic.Package />, desc: t("analyzeWhichProductsSelling"), path: "/reports/sales/product" },
        { title: t("customerWiseSales"), icon: <Ic.Users />, desc: t("salesDataAggregatedByCustomer"), path: "/reports/sales/customer" },
        { title: t("salesProfitLoss"), icon: <Ic.TrendUp />, desc: t("profitMarginsOnEachSale"), path: "/reports/sales/profit" },
        { title: t("refundsReturns"), icon: <Ic.RefreshCw />, desc: t("trackSalesPurchaseReturns"), path: "/reports/refunds" },
      ]
    },
    {
      name: t("purchasesSuppliers"),
      reports: [
        { title: t("purchaseReport"), icon: <Ic.ShoppingCart />, desc: t("trackAllStockPurchases"), path: "/reports/purchase" },
        { title: t("itemWisePurchase"), icon: <Ic.Package />, desc: t("purchasesGroupedByProducts"), path: "/reports/purchases/items" },
        { title: t("supplierReport"), icon: <Ic.User />, desc: t("overviewAllSuppliersDues"), path: "/reports/suppliers" },
        { title: t("supplierItemAnalysis"), icon: <Ic.Package />, desc: t("productsSourcedFromSuppliers"), path: "/reports/suppliers/items" },
        { title: t("supplierProfitability"), icon: <Ic.Cash />, desc: t("profitAnalysisBySupplier"), path: "/reports/suppliers/profit-loss" },
      ]
    },
    {
      name: t("financeExpenses"),
      reports: [
        { title: t("cashFlow"), icon: <Ic.TrendUp />, desc: t("monitorCashInflowsOutflows"), path: "/reports/cash-flow" },
        { title: t("bankPayments"), icon: <Ic.Card />, desc: t("reportAllBankTransactions"), path: "/reports/payments/bank" },
        { title: t("expenseReport"), icon: <Ic.Eye />, desc: t("categorizedBusinessExpenses"), path: "/reports/expenses" },
        { title: t("inventoryValuation"), icon: <Ic.Package />, desc: t("currentStockLevelsValuation"), path: "/reports/inventory" },
      ]
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40 }}>
      <div>
        <h1 style={{ color: T.text, margin: 0 }}>{t("reportsAnalytics")}</h1>
        <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("comprehensiveDataAnalysis")}</p>
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
