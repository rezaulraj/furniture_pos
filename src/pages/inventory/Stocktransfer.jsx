import { useState, useRef, useEffect } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Transfer History Data ──────────────────────────────────────── */
const TRANSFER_HISTORY = [
  {
    id: 1,
    tId: "TRF-041",
    product: "Teak Wood Sofa 3-Seater",
    sku: "TWS-301",
    img: "🛋️",
    from: "Main Store — Dhaka",
    to: "Branch — Sylhet",
    qty: 3,
    initiatedBy: "Admin",
    approvedBy: "Manager",
    date: "2026-04-03",
    completedDate: "2026-04-04",
    status: "completed",
    notes: "Restock Sylhet branch",
  },
  {
    id: 2,
    tId: "TRF-040",
    product: "Bamboo Bookshelf Large",
    sku: "BBL-104",
    img: "📚",
    from: "Main Store — Dhaka",
    to: "Branch — Chittagong",
    qty: 5,
    initiatedBy: "Seller 1",
    approvedBy: null,
    date: "2026-04-04",
    completedDate: null,
    status: "approved",
    notes: "Critical low stock",
  },
  {
    id: 3,
    tId: "TRF-039",
    product: "Rattan Armchair Premium",
    sku: "RAC-110",
    img: "🪑",
    from: "Branch — Chittagong",
    to: "Main Store — Dhaka",
    qty: 4,
    initiatedBy: "Manager",
    approvedBy: null,
    date: "2026-04-03",
    completedDate: null,
    status: "pending",
    notes: "",
  },
  {
    id: 4,
    tId: "TRF-038",
    product: "Pine Wood Nightstand",
    sku: "PIN-801",
    img: "🌙",
    from: "Main Store — Dhaka",
    to: "Branch — Chittagong",
    qty: 6,
    initiatedBy: "Admin",
    approvedBy: "Admin",
    date: "2026-04-01",
    completedDate: "2026-04-02",
    status: "completed",
    notes: "",
  },
  {
    id: 5,
    tId: "TRF-037",
    product: "Mahogany Coffee Table",
    sku: "MCT-405",
    img: "☕",
    from: "Branch — Sylhet",
    to: "Branch — Chittagong",
    qty: 2,
    initiatedBy: "Seller 2",
    approvedBy: "Manager",
    date: "2026-03-31",
    completedDate: null,
    status: "in_transit",
    notes: "Expected 3 days",
  },
  {
    id: 6,
    tId: "TRF-036",
    product: "Oak Dining Table 6-Person",
    sku: "ODT-612",
    img: "🪑",
    from: "Main Store — Dhaka",
    to: "Branch — Sylhet",
    qty: 1,
    initiatedBy: "Admin",
    approvedBy: null,
    date: "2026-03-30",
    completedDate: null,
    status: "rejected",
    notes: "Insufficient quantity",
  },
];

const PRODUCTS_STOCK = [
  {
    id: 1,
    sku: "TWS-301",
    name: "Teak Wood Sofa 3-Seater",
    img: "🛋️",
    stocks: {
      "Main Store — Dhaka": 12,
      "Branch — Chittagong": 4,
      "Branch — Sylhet": 2,
    },
  },
  {
    id: 2,
    sku: "ODT-612",
    name: "Oak Dining Table 6-Person",
    img: "🪑",
    stocks: {
      "Main Store — Dhaka": 7,
      "Branch — Chittagong": 3,
      "Branch — Sylhet": 1,
    },
  },
  {
    id: 3,
    sku: "WDB-204",
    name: "Walnut Double Bed Frame",
    img: "🛏️",
    stocks: {
      "Main Store — Dhaka": 9,
      "Branch — Chittagong": 5,
      "Branch — Sylhet": 6,
    },
  },
  {
    id: 4,
    sku: "BBL-104",
    name: "Bamboo Bookshelf Large",
    img: "📚",
    stocks: {
      "Main Store — Dhaka": 15,
      "Branch — Chittagong": 2,
      "Branch — Sylhet": 8,
    },
  },
  {
    id: 5,
    sku: "RAC-110",
    name: "Rattan Armchair Premium",
    img: "🪑",
    stocks: {
      "Main Store — Dhaka": 20,
      "Branch — Chittagong": 6,
      "Branch — Sylhet": 11,
    },
  },
  {
    id: 6,
    sku: "MCT-405",
    name: "Mahogany Coffee Table",
    img: "☕",
    stocks: {
      "Main Store — Dhaka": 9,
      "Branch — Chittagong": 4,
      "Branch — Sylhet": 3,
    },
  },
  {
    id: 7,
    sku: "PIN-801",
    name: "Pine Wood Nightstand",
    img: "🌙",
    stocks: {
      "Main Store — Dhaka": 18,
      "Branch — Chittagong": 7,
      "Branch — Sylhet": 4,
    },
  },
  {
    id: 8,
    sku: "TKW-702",
    name: "Teak Wood Wardrobe 3-Door",
    img: "🚪",
    stocks: {
      "Main Store — Dhaka": 4,
      "Branch — Chittagong": 1,
      "Branch — Sylhet": 2,
    },
  },
];

const STORES = ["Main Store — Dhaka", "Branch — Chittagong", "Branch — Sylhet"];

const STATUS_CONFIG = {
  pending: {
    color: T.yellow,
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
    icon: "⏳",
  },
  approved: {
    color: T.blue,
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.25)",
    icon: "✓",
  },
  in_transit: {
    color: T.purple,
    bg: "rgba(192,132,252,0.1)",
    border: "rgba(192,132,252,0.25)",
    icon: "🚛",
  },
  completed: {
    color: T.green,
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.25)",
    icon: "✅",
  },
  rejected: {
    color: T.red,
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
    icon: "✗",
  },
  cancelled: {
    color: T.textMut,
    bg: "rgba(90,61,30,0.1)",
    border: T.border,
    icon: "✗",
  },
};

/* ── New Transfer Modal ─────────────────────────────────────────── */
const NewTransferModal = ({ onClose, onSave }) => {
  const [fromStore, setFromStore] = useState("Main Store — Dhaka");
  const [toStore, setToStore] = useState("Branch — Chittagong");
  const [product, setProduct] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [showPS, setShowPS] = useState(false);
  const [qty, setQty] = useState("1");
  const [notes, setNotes] = useState("");
  const psRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (psRef.current && !psRef.current.contains(e.target)) setShowPS(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const availableStock = product ? product.stocks[fromStore] || 0 : 0;
  const qtyNum = parseInt(qty) || 0;
  const isValid =
    product && fromStore !== toStore && qtyNum > 0 && qtyNum <= availableStock;

  const filteredProducts = PRODUCTS_STOCK.filter(
    (p) =>
      (p.stocks[fromStore] || 0) > 0 &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase())),
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          ...card(),
          width: 500,
          padding: "24px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.5)",
          animation: "slideUp .25s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                color: T.text,
                fontWeight: 900,
                fontSize: 16,
                margin: 0,
              }}
            >
              New Stock Transfer
            </h3>
            <p style={{ color: T.textSub, fontSize: 11, margin: "3px 0 0" }}>
              Move inventory between stores
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {/* From → To visual */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <Select
              label="From Store"
              value={fromStore}
              onChange={(e) => {
                setFromStore(e.target.value);
                setProduct(null);
              }}
              options={STORES.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div
            style={{
              paddingTop: 20,
              color: T.gold,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            →
          </div>
          <div style={{ flex: 1 }}>
            <Select
              label="To Store"
              value={toStore}
              onChange={(e) => setToStore(e.target.value)}
              options={STORES.filter((s) => s !== fromStore).map((s) => ({
                value: s,
                label: s,
              }))}
            />
          </div>
        </div>

        {fromStore === toStore && (
          <div
            style={{
              padding: "9px 12px",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                color: T.red,
                fontSize: 11.5,
                fontWeight: 600,
                margin: 0,
              }}
            >
              ⚠️ Source and destination stores must be different
            </p>
          </div>
        )}

        {/* Product search */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              color: T.textSub,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.07em",
              display: "block",
              marginBottom: 6,
            }}
          >
            PRODUCT *
          </label>
          {product ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "rgba(74,222,128,0.06)",
                borderRadius: 9,
                border: "1px solid rgba(74,222,128,0.2)",
              }}
            >
              <span style={{ fontSize: 22 }}>{product.img}</span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: T.text,
                    fontWeight: 700,
                    fontSize: 12,
                    margin: 0,
                  }}
                >
                  {product.name}
                </p>
                <div style={{ display: "flex", gap: 7, marginTop: 3 }}>
                  <Badge color="gold" small>
                    {product.sku}
                  </Badge>
                  <span style={{ color: T.textSub, fontSize: 10 }}>
                    Available in {fromStore.split(" — ")[0]}:{" "}
                    <strong style={{ color: T.green }}>{availableStock}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProduct(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.textMut,
                }}
              >
                <Ic.Close />
              </button>
            </div>
          ) : (
            <div ref={psRef} style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.bg3,
                  border: `1px solid ${showPS ? T.gold : T.border}`,
                  borderRadius: 8,
                  padding: "8px 11px",
                }}
              >
                <span style={{ color: T.textMut, display: "flex" }}>
                  <Ic.Search />
                </span>
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onFocus={() => setShowPS(true)}
                  placeholder="Search product to transfer..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: T.text,
                    fontSize: 12,
                  }}
                />
              </div>
              {showPS && (
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    right: 0,
                    background: "#160e04",
                    border: `1px solid ${T.border}`,
                    borderRadius: 9,
                    zIndex: 55,
                    maxHeight: 200,
                    overflowY: "auto",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setProduct(p);
                        setShowPS(false);
                        setProductSearch("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        cursor: "pointer",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(139,90,43,0.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ fontSize: 20 }}>{p.img}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: T.text,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            color: T.gold,
                            fontSize: 10,
                            fontFamily: "monospace",
                          }}
                        >
                          {p.sku}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            color: T.green,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {p.stocks[fromStore] || 0}
                        </div>
                        <div style={{ color: T.textMut, fontSize: 9.5 }}>
                          available
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div
                      style={{
                        padding: "14px",
                        color: T.textSub,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      No products with stock in {fromStore.split(" — ")[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Qty & Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 6,
              }}
            >
              QUANTITY *
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() =>
                  setQty((prev) =>
                    String(Math.max(1, (parseInt(prev) || 1) - 1)),
                  )
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 7,
                  background: "rgba(139,90,43,0.18)",
                  border: "none",
                  color: T.gold,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic.Minus />
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                type="number"
                min="1"
                max={availableStock}
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: T.bg3,
                  border: `1px solid ${parseInt(qty) > availableStock ? "rgba(248,113,113,0.5)" : T.border}`,
                  borderRadius: 8,
                  padding: "8px",
                  color: T.text,
                  fontSize: 16,
                  fontWeight: 800,
                  outline: "none",
                }}
              />
              <button
                onClick={() =>
                  setQty((prev) =>
                    String(Math.min(availableStock, (parseInt(prev) || 0) + 1)),
                  )
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 7,
                  background: "rgba(139,90,43,0.18)",
                  border: "none",
                  color: T.gold,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic.Plus />
              </button>
              {product && (
                <button
                  onClick={() => setQty(String(availableStock))}
                  style={{
                    padding: "6px 11px",
                    background: "rgba(205,133,63,0.15)",
                    border: "1px solid rgba(205,133,63,0.3)",
                    color: T.gold,
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Max
                </button>
              )}
            </div>
            {parseInt(qty) > availableStock && (
              <p style={{ color: T.red, fontSize: 10.5, margin: "4px 0 0" }}>
                ⚠️ Exceeds available stock ({availableStock})
              </p>
            )}
          </div>
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 6,
              }}
            >
              NOTES
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Reason for transfer..."
              style={{
                width: "100%",
                background: T.bg3,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: T.text,
                fontSize: 12,
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.gold)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
        </div>

        {/* Preview */}
        {isValid && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              background: "rgba(96,165,250,0.07)",
              border: "1px solid rgba(96,165,250,0.25)",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: T.blue,
                fontSize: 11,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              📋 Transfer Preview
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                  {fromStore.split(" — ")[0]}
                </p>
                <p
                  style={{
                    color: T.text,
                    fontSize: 14,
                    fontWeight: 800,
                    margin: "2px 0 0",
                  }}
                >
                  {availableStock} → {availableStock - qtyNum}
                </p>
              </div>
              <div style={{ color: T.gold, fontSize: 20, alignSelf: "center" }}>
                →
              </div>
              <div>
                <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                  {toStore.split(" — ")[0]}
                </p>
                <p
                  style={{
                    color: T.text,
                    fontSize: 14,
                    fontWeight: 800,
                    margin: "2px 0 0",
                  }}
                >
                  {product.stocks[toStore] || 0} →{" "}
                  {(product.stocks[toStore] || 0) + qtyNum}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <Btn
            onClick={() => {
              if (isValid) {
                onSave({ product, fromStore, toStore, qty: qtyNum, notes });
                onClose();
              }
            }}
            disabled={!isValid}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Transfer /> Initiate Transfer
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STOCK TRANSFER PAGE
════════════════════════════════════════════════════════════════ */
export default function StockTransfer() {
  const [transfers, setTransfers] = useState(TRANSFER_HISTORY);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = transfers.filter((t) => {
    const ms =
      t.tId.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.sku.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "all" || t.status === statusFilter;
    const mstr =
      storeFilter === "all" || t.from === storeFilter || t.to === storeFilter;
    return ms && mst && mstr;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((t) => t.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const updateStatus = (id, status) =>
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              approvedBy: status === "approved" ? "Manager" : t.approvedBy,
            }
          : t,
      ),
    );

  const handleNewTransfer = (data) => {
    const newT = {
      id: Date.now(),
      tId: `TRF-${Date.now().toString().slice(-3)}`,
      product: data.product.name,
      sku: data.product.sku,
      img: data.product.img,
      from: data.fromStore,
      to: data.toStore,
      qty: data.qty,
      initiatedBy: "Admin",
      approvedBy: null,
      date: "2026-04-04",
      completedDate: null,
      status: "pending",
      notes: data.notes,
    };
    setTransfers((prev) => [newT, ...prev]);
  };

  const pending = transfers.filter((t) => t.status === "pending").length;
  const inTransit = transfers.filter((t) => t.status === "in_transit").length;
  const totalQtyMoved = transfers
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.qty, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Transfers",
            value: transfers.length,
            sub: "All time",
            color: T.blue,
            icon: "🔄",
          },
          {
            label: "Pending Approval",
            value: pending,
            sub: "Awaiting review",
            color: T.yellow,
            icon: "⏳",
          },
          {
            label: "In Transit",
            value: inTransit,
            sub: "Currently moving",
            color: T.purple,
            icon: "🚛",
          },
          {
            label: "Units Moved",
            value: totalQtyMoved,
            sub: "Completed transfers",
            color: T.green,
            icon: "📦",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
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
                fontSize: 60,
                opacity: 0.05,
              }}
            >
              {k.icon}
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: k.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 9.5,
                  margin: 0,
                  letterSpacing: "0.06em",
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: T.text,
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "2px 0 2px",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Store flow diagram ── */}
      <div style={{ ...card(), padding: "16px 18px" }}>
        <p
          style={{
            color: T.textMut,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.09em",
            margin: "0 0 14px",
          }}
        >
          INTER-STORE TRANSFER FLOW
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {STORES.map((store, i) => {
            const outgoing = transfers.filter(
              (t) => t.from === store && t.status !== "rejected",
            ).length;
            const incoming = transfers.filter(
              (t) => t.to === store && t.status !== "rejected",
            ).length;
            return (
              <div
                key={store}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    background: T.bg3,
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    textAlign: "center",
                    minWidth: 130,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🏪</div>
                  <p
                    style={{
                      color: T.text,
                      fontWeight: 700,
                      fontSize: 12,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {store.split(" — ")[0]}
                  </p>
                  <p
                    style={{
                      color: T.textSub,
                      fontSize: 9.5,
                      margin: "3px 0 8px",
                    }}
                  >
                    {store.split(" — ")[1] || ""}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: T.red,
                          fontSize: 11,
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {outgoing}
                      </p>
                      <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                        out
                      </p>
                    </div>
                    <div style={{ width: 1, background: T.border }} />
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: T.green,
                          fontSize: 11,
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {incoming}
                      </p>
                      <p style={{ color: T.textMut, fontSize: 9, margin: 0 }}>
                        in
                      </p>
                    </div>
                  </div>
                </div>
                {i < STORES.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      alignItems: "center",
                      color: T.textMut,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⇆</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters + New Transfer ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transfer ID, product, SKU..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "⏳ Pending" },
            { value: "approved", label: "✓ Approved" },
            { value: "in_transit", label: "🚛 In Transit" },
            { value: "completed", label: "✅ Completed" },
            { value: "rejected", label: "✗ Rejected" },
          ]}
        />
        <Select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          options={[
            { value: "all", label: "All Stores" },
            ...STORES.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Btn variant="ghost" size="sm">
          <Ic.Download /> Export
        </Btn>
        <Btn onClick={() => setShowNewModal(true)}>
          <Ic.Transfer /> New Transfer
        </Btn>
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "9px 14px",
            background: "rgba(96,165,250,0.07)",
            borderColor: "rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Badge color="blue">{selected.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn
            variant="success"
            size="sm"
            onClick={() => {
              selected.forEach((id) => updateStatus(id, "approved"));
              setSelected(new Set());
            }}
          >
            <Ic.Check /> Bulk Approve
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textMut,
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      {/* ── Transfer Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Header */}
        <div
          style={{
            ...card(),
            padding: "10px 14px",
            background: T.bg2,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <input
            type="checkbox"
            checked={selected.size === filtered.length && filtered.length > 0}
            onChange={toggleAll}
            style={{ cursor: "pointer", accentColor: T.gold, flexShrink: 0 }}
          />
          {[
            "TRF ID",
            "PRODUCT",
            "FROM",
            "→ TO",
            "QTY",
            "STATUS",
            "INITIATED",
            "DATE",
            "ACTIONS",
          ].map((h, i) => (
            <span
              key={h}
              style={{
                color: T.textMut,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.07em",
                flex:
                  h === "PRODUCT" ? 2 : h === "FROM" || h === "→ TO" ? 1.5 : 1,
                minWidth: 0,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.map((t) => {
          const isSel = selected.has(t.id);
          const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
          return (
            <div
              key={t.id}
              style={{
                ...card(),
                padding: "13px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderLeft: `3px solid ${sc.color}`,
                background: isSel ? sc.bg : T.card,
                borderColor: isSel ? sc.border : T.border,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                if (!isSel) e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => toggle(t.id)}
                style={{
                  cursor: "pointer",
                  accentColor: T.gold,
                  flexShrink: 0,
                }}
              />

              {/* TRF ID */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: T.purple,
                    fontWeight: 800,
                    fontSize: 11.5,
                    fontFamily: "monospace",
                  }}
                >
                  {t.tId}
                </div>
              </div>

              {/* Product */}
              <div
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(139,90,43,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {t.img}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: T.text,
                      fontSize: 12,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.product}
                  </div>
                  <Badge color="gold" small>
                    {t.sku}
                  </Badge>
                </div>
              </div>

              {/* From */}
              <div style={{ flex: 1.5, minWidth: 0 }}>
                <div
                  style={{
                    color: T.red,
                    fontSize: 10,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  FROM
                </div>
                <div
                  style={{
                    color: T.text,
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.from.split(" — ")[0]}
                </div>
              </div>

              {/* To */}
              <div style={{ flex: 1.5, minWidth: 0 }}>
                <div
                  style={{
                    color: T.green,
                    fontSize: 10,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  TO
                </div>
                <div
                  style={{
                    color: T.text,
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.to.split(" — ")[0]}
                </div>
              </div>

              {/* Qty */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ color: T.blue, fontWeight: 900, fontSize: 18 }}>
                  {t.qty}
                </div>
                <div style={{ color: T.textMut, fontSize: 9 }}>UNITS</div>
              </div>

              {/* Status */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{sc.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 20,
                      background: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {t.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                {t.approvedBy && (
                  <div
                    style={{ color: T.textMut, fontSize: 9.5, marginTop: 3 }}
                  >
                    By {t.approvedBy}
                  </div>
                )}
              </div>

              {/* Initiated */}
              <div style={{ flex: 1 }}>
                <div style={{ color: T.textSub, fontSize: 11 }}>
                  {t.initiatedBy}
                </div>
              </div>

              {/* Date */}
              <div style={{ flex: 1 }}>
                <div style={{ color: T.textSub, fontSize: 11 }}>{t.date}</div>
                {t.completedDate && (
                  <div style={{ color: T.green, fontSize: 10 }}>
                    Done: {t.completedDate}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ flex: 1, display: "flex", gap: 5, flexShrink: 0 }}>
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(t.id, "approved")}
                      title="Approve"
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        background: "rgba(74,222,128,0.1)",
                        border: "1px solid rgba(74,222,128,0.2)",
                        color: T.green,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic.Check />
                    </button>
                    <button
                      onClick={() => updateStatus(t.id, "rejected")}
                      title="Reject"
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: T.red,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic.Close />
                    </button>
                  </>
                )}
                {t.status === "approved" && (
                  <button
                    onClick={() => updateStatus(t.id, "in_transit")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 7,
                      background: "rgba(192,132,252,0.1)",
                      border: "1px solid rgba(192,132,252,0.2)",
                      color: T.purple,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    🚛 Ship
                  </button>
                )}
                {t.status === "in_transit" && (
                  <button
                    onClick={() => updateStatus(t.id, "completed")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 7,
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.2)",
                      color: T.green,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ic.Check /> Receive
                  </button>
                )}
                <button
                  title="View"
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 7,
                    background: "rgba(96,165,250,0.1)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    color: T.blue,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic.Eye />
                </button>
                <button
                  title="Print"
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 7,
                    background: "rgba(139,90,43,0.08)",
                    border: `1px solid ${T.border}`,
                    color: T.gold,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic.Print />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ ...card(), padding: "52px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔄</div>
            <p
              style={{
                color: T.textSub,
                fontSize: 14,
                fontWeight: 600,
                margin: 0,
              }}
            >
              No transfers found
            </p>
            <Btn
              onClick={() => setShowNewModal(true)}
              style={{ marginTop: 14 }}
            >
              <Ic.Plus /> Create First Transfer
            </Btn>
          </div>
        )}
      </div>

      {/* Footer summary */}
      {filtered.length > 0 && (
        <div
          style={{
            ...card(),
            padding: "12px 16px",
            background: T.bg2,
            display: "flex",
            gap: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: T.textMut,
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.07em",
            }}
          >
            SUMMARY
          </span>
          {[
            ["Transfers", filtered.length, T.text],
            ["Total Units", filtered.reduce((s, t) => s + t.qty, 0), T.blue],
            [
              "Completed",
              filtered.filter((t) => t.status === "completed").length,
              T.green,
            ],
            [
              "Pending",
              filtered.filter((t) => t.status === "pending").length,
              T.yellow,
            ],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{ display: "flex", gap: 6, alignItems: "center" }}
            >
              <span style={{ color: T.textSub, fontSize: 11 }}>{l}:</span>
              <span style={{ color: c, fontWeight: 800, fontSize: 13 }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}

      {showNewModal && (
        <NewTransferModal
          onClose={() => setShowNewModal(false)}
          onSave={handleNewTransfer}
        />
      )}
    </div>
  );
}
