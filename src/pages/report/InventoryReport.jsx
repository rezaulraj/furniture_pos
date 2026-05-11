import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useInventoryStore } from "../../store/inventoryStore";
import { useProductStore } from "../../store/productStore";
import { Select } from "../../components/Input";
import { Badge } from "../../components/Badge";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function InventoryReport() {
  const { t } = useLanguageStore();
  const { inventory, fetchInventory, isLoading } = useInventoryStore();
  const { products, fetchProducts } = useProductStore();
  const [storeFilter, setStoreFilter] = useState("all");

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, [fetchInventory, fetchProducts]);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      return storeFilter === "all" || String(item.store_id) === storeFilter;
    });
  }, [inventory, storeFilter]);

  const stats = useMemo(() => {
    const totalItems = filtered.reduce((a, b) => a + Number(b.quantity || 0), 0);
    // Valuation based on product purchase price if available
    const valuation = filtered.reduce((acc, item) => {
      const prod = products.find(p => p.product_id === item.product_id);
      return acc + (Number(item.quantity || 0) * Number(prod?.purchase_price || 0));
    }, 0);
    
    const lowStockCount = filtered.filter(item => {
      const prod = products.find(p => p.product_id === item.product_id);
      return Number(item.quantity) <= Number(prod?.min_stock_level || 5);
    }).length;

    return { totalItems, valuation, lowStockCount, types: new Set(filtered.map(x => x.product_id)).size };
  }, [filtered, products]);

  const stores = useMemo(() => {
    const s = new Map();
    inventory.forEach(x => {
      if(x.store) s.set(x.store_id, x.store.store_name);
    });
    return Array.from(s.entries()).map(([id, name]) => ({ value: String(id), label: name }));
  }, [inventory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("inventoryReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("stockLevelsAssetValuation")}</p>
        </div>
        <button onClick={() => window.print()} style={btnStyle()}><Ic.Print /> {t("print")}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label={t("totalStock")} value={stats.totalItems} icon="📦" color={T.blue} />
        <StatCard label={t("stockValue")} value={money(stats.valuation)} icon="💎" color={T.green} />
        <StatCard label={t("lowStockItems")} value={stats.lowStockCount} icon="⚠️" color={T.red} />
        <StatCard label={t("productTypes")} value={stats.types} icon="🏷️" color={T.accent} />
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ width: 300 }}>
          <Select label={t("filterByStore")} value={storeFilter} onChange={e => setStoreFilter(e.target.value)} options={[{ value: "all", label: t("allStores") }, ...stores]} />
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => fetchInventory()} style={btnStyle()}><Ic.RefreshCw /> {t("refresh")}</button>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("product"), t("sku"), t("store"), t("currentStock"), t("unitPrice"), t("totalValue"), t("status")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : filtered.length === 0 ? (
               <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              filtered.map(item => {
                const prod = products.find(p => p.product_id === item.product_id);
                const isLow = Number(item.quantity) <= Number(prod?.min_stock_level || 5);
                return (
                  <tr key={item.inventory_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{prod?.product_name || t("unknownProduct")}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{prod?.sku || "—"}</td>
                    <td style={{ padding: "12px 15px", color: T.textSub }}>{item.store?.store_name}</td>
                    <td style={{ padding: "12px 15px", color: isLow ? T.red : T.text, fontWeight: 900 }}>{item.quantity}</td>
                    <td style={{ padding: "12px 15px", color: T.textMut }}>{money(prod?.purchase_price)}</td>
                    <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(item.quantity * (prod?.purchase_price || 0))}</td>
                    <td style={{ padding: "12px 15px" }}>
                      <Badge color={isLow ? "red" : "green"}>{isLow ? t("lowStock") : t("inStock")}</Badge>
                    </td>
                  </tr>
                );
              })
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

function btnStyle() {
  return {
    padding: "10px 18px",
    borderRadius: 10,
    border: `1px solid ${T.border}`,
    background: T.bg3,
    color: T.text,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
}
