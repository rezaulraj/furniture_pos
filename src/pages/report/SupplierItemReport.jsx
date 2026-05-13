import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function SupplierItemReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    try {
      const res = await fetchReport("suppliers/items", { page, limit: 10 });
      if (res && Array.isArray(res.data)) {
        setData(res.data);
        setPagination(res.meta);
      } else {
        setData(res || []);
        setPagination(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("supplierItemAnalysis")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("trackProductsSourcedSuppliers")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("supplierName"), t("productName"), t("sku"), t("totalQty"), t("totalValue")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : data.length === 0 ? (
               <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              data.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.text, fontWeight: 600 }}>{item.supplier_name}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{item.product_name}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{item.sku}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{item.total_quantity}</td>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{money(item.total_amount)}</td>
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
