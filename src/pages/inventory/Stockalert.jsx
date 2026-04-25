import { useEffect, useMemo } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { useInventoryStore } from "../../store/inventoryStore";

const getStatus = (qty, min) => {
  if (qty === 0) return "out";
  if (qty <= min) return "low";
  return "ok";
};

export default function StockAlert() {
  const { inventory, fetchInventory, isLoading } = useInventoryStore();

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔥 ONLY LOW + OUT STOCK
  const alertItems = useMemo(() => {
    return inventory.filter((item) => {
      const status = getStatus(item.quantity || 0, item.minimum_stock || 0);
      return status === "low" || status === "out";
    });
  }, [inventory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
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
          <p style={{ color: T.textSub, fontSize: 12 }}>
            Low & Out of stock products
          </p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ ...card(), padding: 16 }}>
        <p style={{ color: T.textSub, fontSize: 12 }}>
          Total Alert Items:{" "}
          <strong style={{ color: T.red }}>{alertItems.length}</strong>
        </p>
      </div>

      {/* Table */}
      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
            padding: "14px 16px",
            background: T.bg2,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>Product</div>
          <div>Store</div>
          <div>Qty</div>
          <div>Min</div>
          <div>Status</div>
        </div>

        {isLoading ? (
          <div style={{ padding: 30, textAlign: "center" }}>Loading...</div>
        ) : alertItems.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            🎉 All stocks are healthy!
          </div>
        ) : (
          alertItems.map((item) => {
            const status = getStatus(
              item.quantity || 0,
              item.minimum_stock || 0,
            );

            return (
              <div
                key={item.inventory_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <div>
                  <b>{item.product?.product_name}</b>
                  <div style={{ fontSize: 11, color: T.textSub }}>
                    {item.product?.sku}
                  </div>
                </div>

                <div>{item.store?.store_name}</div>

                <div style={{ fontWeight: 900 }}>{item.quantity}</div>

                <div>{item.minimum_stock}</div>

                <div>
                  <Badge color={status === "out" ? "red" : "yellow"}>
                    {status === "out" ? "OUT" : "LOW"}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
