import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useStockAlertStore } from "../../store/stockAlertStore";
import { useBranchStore } from "../../store/branchStore";

const getLowStatus = (item) => {
  if (Number(item.quantity || 0) === 0) return "out";
  return "low";
};

export default function StockAlert() {
  const {
    lowStockAlerts,
    overStockAlerts,
    summary,
    isLoading,
    error,
    fetchAllStockAlerts,
  } = useStockAlertStore();

  const { branches, fetchBranches } = useBranchStore();

  const [storeFilter, setStoreFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("low");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBranches({ is_active: true });
    fetchAllStockAlerts();
  }, [fetchBranches, fetchAllStockAlerts]);

  const handleStoreChange = async (value) => {
    setStoreFilter(value);

    const params = value === "all" ? {} : { store_id: value };
    await fetchAllStockAlerts(params);
  };

  const activeAlerts =
    typeFilter === "overstock" ? overStockAlerts : lowStockAlerts;

  const filteredAlerts = useMemo(() => {
    const q = search.toLowerCase();

    return activeAlerts.filter((item) => {
      return (
        item.product?.product_name?.toLowerCase().includes(q) ||
        item.product?.sku?.toLowerCase().includes(q) ||
        item.store?.store_name?.toLowerCase().includes(q)
      );
    });
  }, [activeAlerts, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#dc2626,#991b1b)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontSize: 22,
          }}
        >
          ⚠️
        </div>

        <div>
          <h1 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            Stock Alert
          </h1>
          <p style={{ color: T.textSub, fontSize: 12, margin: "4px 0 0" }}>
            Low stock, out of stock and overstock products from API
          </p>
        </div>

        <Btn
          variant="ghost"
          onClick={() =>
            fetchAllStockAlerts(
              storeFilter === "all" ? {} : { store_id: storeFilter },
            )
          }
          style={{ marginLeft: "auto" }}
        >
          Refresh
        </Btn>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          ["Low Stock", summary.lowStockCount || 0, T.yellow, "📉"],
          ["Out of Stock", summary.outOfStockCount || 0, T.red, "🚫"],
          ["Overstock", summary.overStockCount || 0, T.blue, "📦"],
          ["Showing", filteredAlerts.length, T.accent, "👁️"],
        ].map(([label, value, color, icon]) => (
          <div
            key={label}
            style={{
              ...card(),
              padding: 16,
              borderLeft: `4px solid ${color}`,
            }}
          >
            <p
              style={{
                color: T.textSub,
                margin: 0,
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              {label.toUpperCase()}
            </p>
            <p
              style={{
                color,
                margin: "6px 0 0",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {icon} {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, SKU, store..."
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="low">Low / Out Stock</option>
          <option value="overstock">Overstock</option>
        </select>

        <select
          value={storeFilter}
          onChange={(e) => handleStoreChange(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Stores</option>
          {branches.map((branch) => (
            <option key={branch.store_id} value={branch.store_id}>
              {branch.store_name}
            </option>
          ))}
        </select>
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

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              typeFilter === "overstock"
                ? "2fr 1.5fr 1fr 1fr 1fr 1fr"
                : "2fr 1.5fr 1fr 1fr 1fr",
            padding: "14px 16px",
            background: T.bg2,
            borderBottom: `1px solid ${T.border}`,
            gap: 10,
          }}
        >
          <HeaderText>Product</HeaderText>
          <HeaderText>Store</HeaderText>
          <HeaderText>Qty</HeaderText>
          <HeaderText>{typeFilter === "overstock" ? "Max" : "Min"}</HeaderText>
          {typeFilter === "overstock" && <HeaderText>Extra</HeaderText>}
          <HeaderText>Status</HeaderText>
        </div>

        {isLoading ? (
          <div style={{ padding: 34, textAlign: "center", color: T.textSub }}>
            Loading stock alerts...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div style={{ padding: 44, textAlign: "center", color: T.textSub }}>
            <div style={{ fontSize: 46, marginBottom: 8 }}>🎉</div>
            No {typeFilter === "overstock" ? "overstock" : "low stock"} alerts
            found
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const status = getLowStatus(item);
            const isOver = typeFilter === "overstock";
            const extraQty =
              Number(item.quantity || 0) - Number(item.maximum_stock || 0);

            return (
              <div
                key={item.inventory_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: isOver
                    ? "2fr 1.5fr 1fr 1fr 1fr 1fr"
                    : "2fr 1.5fr 1fr 1fr 1fr",
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div>
                  <b style={{ color: T.text }}>{item.product?.product_name}</b>
                  <div style={{ fontSize: 11, color: T.textSub }}>
                    {item.product?.sku || "NO-SKU"}
                  </div>
                </div>

                <div style={{ color: T.textSub }}>
                  {item.store?.store_name || "Unknown Store"}
                </div>

                <div style={{ color: T.text, fontWeight: 900 }}>
                  {item.quantity}
                </div>

                <div style={{ color: T.textSub }}>
                  {isOver ? item.maximum_stock : item.minimum_stock}
                </div>

                {isOver && (
                  <div style={{ color: T.blue, fontWeight: 900 }}>
                    +{extraQty}
                  </div>
                )}

                <div>
                  {isOver ? (
                    <Badge color="blue">OVERSTOCK</Badge>
                  ) : (
                    <Badge color={status === "out" ? "red" : "yellow"}>
                      {status === "out" ? "OUT" : "LOW"}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function HeaderText({ children }) {
  return (
    <div style={{ color: T.textMut, fontSize: 10, fontWeight: 900 }}>
      {children.toUpperCase()}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    minWidth: 180,
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "11px 12px",
    color: T.text,
    outline: "none",
  };
}
