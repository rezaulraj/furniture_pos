import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useStockTransferStore } from "../../store/stockTransferStore";
import { useProductStore } from "../../store/productStore";
import { useBranchStore } from "../../store/branchStore";
import { useInventoryStore } from "../../store/inventoryStore";

const STATUS = [
  "pending",
  "approved",
  "in_transit",
  "completed",
  "cancelled",
  "rejected",
];

const statusColor = (status) => {
  if (status === "completed") return "green";
  if (status === "approved" || status === "in_transit") return "blue";
  if (status === "pending") return "yellow";
  return "red";
};

const inputStyle = () => ({
  width: "100%",
  boxSizing: "border-box",
  background: T.bg3,
  border: `1px solid ${T.border}`,
  borderRadius: 12,
  padding: "11px 12px",
  color: T.text,
  outline: "none",
});

const getAvailableStock = (inventory, storeId, productId) => {
  const item = inventory.find(
    (x) =>
      Number(x.store_id) === Number(storeId) &&
      Number(x.product_id) === Number(productId),
  );

  return Number(item?.quantity || 0);
};

function NewTransferModal({
  onClose,
  onSubmit,
  loading,
  error,
  products,
  branches,
  inventory,
}) {
  const [form, setForm] = useState({
    source_store_id: "",
    destination_store_id: "",
    product_id: "",
    quantity: 1,
    notes: "",
  });

  const [productSearch, setProductSearch] = useState("");
  const [showProductSuggest, setShowProductSuggest] = useState(false);

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const availableStock = getAvailableStock(
    inventory,
    form.source_store_id,
    form.product_id,
  );

  const selectedProduct = products.find(
    (p) => Number(p.product_id) === Number(form.product_id),
  );

  const selectedSource = branches.find(
    (b) => Number(b.store_id) === Number(form.source_store_id),
  );

  const selectedDestination = branches.find(
    (b) => Number(b.store_id) === Number(form.destination_store_id),
  );

  const productsWithSourceStock = products.filter((p) => {
    if (!form.source_store_id) return true;

    const stock = getAvailableStock(
      inventory,
      form.source_store_id,
      p.product_id,
    );

    return stock > 0;
  });

  const suggestedProducts = productsWithSourceStock.filter((p) => {
    const q = productSearch.toLowerCase();

    return (
      p.product_name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.category_name?.toLowerCase().includes(q)
    );
  });

  const selectProduct = (product) => {
    setForm((p) => ({
      ...p,
      product_id: String(product.product_id),
      quantity: 1,
    }));

    setProductSearch(`${product.product_name} (${product.sku})`);
    setShowProductSuggest(false);
  };

  const clearProduct = () => {
    setForm((p) => ({
      ...p,
      product_id: "",
      quantity: 1,
    }));

    setProductSearch("");
    setShowProductSuggest(false);
  };

  const validation = () => {
    if (!form.source_store_id) return "Source store is required";
    if (!form.destination_store_id) return "Destination store is required";

    if (form.source_store_id === form.destination_store_id) {
      return "Source and destination stores must be different";
    }

    if (!form.product_id) return "Product is required";
    if (Number(form.quantity) <= 0) return "Quantity must be greater than 0";

    if (Number(form.quantity) > availableStock) {
      return `Insufficient stock. Available: ${availableStock}`;
    }

    return "";
  };

  const handleSubmit = () => {
    const err = validation();
    if (err) return alert(err);

    onSubmit({
      source_store_id: Number(form.source_store_id),
      destination_store_id: Number(form.destination_store_id),
      product_id: Number(form.product_id),
      quantity: Number(form.quantity),
      notes: form.notes?.trim() || null,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div style={{ ...card(), width: "100%", maxWidth: 620, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
              New Stock Transfer
            </h2>
            <p style={{ color: T.textSub, fontSize: 12, margin: "4px 0 0" }}>
              Move stock from one branch to another
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.bg3,
              color: T.text,
              cursor: "pointer",
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              color: T.red,
              borderLeft: `4px solid ${T.red}`,
              background: "rgba(248,113,113,.08)",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Field label="Source Store *">
            <select
              value={form.source_store_id}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  source_store_id: e.target.value,
                  product_id: "",
                  quantity: 1,
                }));
                setProductSearch("");
              }}
              style={inputStyle()}
            >
              <option value="">Select source</option>
              {branches.map((b) => (
                <option key={b.store_id} value={b.store_id}>
                  {b.store_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Destination Store *">
            <select
              value={form.destination_store_id}
              onChange={setField("destination_store_id")}
              style={inputStyle()}
            >
              <option value="">Select destination</option>
              {branches
                .filter(
                  (b) => String(b.store_id) !== String(form.source_store_id),
                )
                .map((b) => (
                  <option key={b.store_id} value={b.store_id}>
                    {b.store_name}
                  </option>
                ))}
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label="Product *">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.bg3,
                  border: `1px solid ${
                    showProductSuggest ? T.accent : T.border
                  }`,
                  borderRadius: 12,
                  padding: "0 12px",
                }}
              >
                <Ic.Search />

                <input
                  value={productSearch}
                  disabled={!form.source_store_id}
                  onFocus={() => {
                    if (form.source_store_id) setShowProductSuggest(true);
                  }}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setForm((p) => ({ ...p, product_id: "" }));
                    setShowProductSuggest(true);
                  }}
                  placeholder={
                    form.source_store_id
                      ? "Write product name or SKU..."
                      : "Select source store first"
                  }
                  style={{
                    flex: 1,
                    height: 42,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: T.text,
                    fontSize: 13,
                  }}
                />

                {productSearch && (
                  <button
                    onClick={clearProduct}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: T.textMut,
                      cursor: "pointer",
                    }}
                  >
                    <Ic.Close />
                  </button>
                )}
              </div>

              {showProductSuggest && form.source_store_id && (
                <div
                  style={{
                    position: "absolute",
                    top: 48,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    ...card(),
                    maxHeight: 240,
                    overflowY: "auto",
                    padding: 6,
                    boxShadow: "0 20px 50px rgba(0,0,0,.35)",
                  }}
                >
                  {suggestedProducts.length === 0 ? (
                    <div
                      style={{
                        padding: 16,
                        color: T.textSub,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      No products with stock in this store
                    </div>
                  ) : (
                    suggestedProducts.map((p) => {
                      const stock = getAvailableStock(
                        inventory,
                        form.source_store_id,
                        p.product_id,
                      );

                      return (
                        <button
                          key={p.product_id}
                          onClick={() => selectProduct(p)}
                          style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            padding: "10px 12px",
                            borderRadius: 10,
                            cursor: "pointer",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: 10,
                            textAlign: "left",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                color: T.text,
                                margin: 0,
                                fontWeight: 800,
                                fontSize: 13,
                              }}
                            >
                              {p.product_name}
                            </p>
                            <p
                              style={{
                                color: T.textMut,
                                margin: "3px 0 0",
                                fontSize: 11,
                              }}
                            >
                              {p.sku} •{" "}
                              {p.category?.category_name || "No Category"}
                            </p>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <p
                              style={{
                                color: T.green,
                                margin: 0,
                                fontWeight: 900,
                                fontSize: 13,
                              }}
                            >
                              {stock}
                            </p>
                            <p
                              style={{
                                color: T.textMut,
                                margin: "2px 0 0",
                                fontSize: 10,
                              }}
                            >
                              stock
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </Field>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Field label="Quantity *">
            <input
              type="number"
              value={form.quantity}
              onChange={setField("quantity")}
              min="1"
              max={availableStock}
              style={inputStyle()}
            />
          </Field>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: T.bg3,
              border: `1px solid ${T.border}`,
            }}
          >
            <p style={{ color: T.textMut, margin: 0, fontSize: 10 }}>
              AVAILABLE STOCK
            </p>
            <p
              style={{
                color: Number(form.quantity) > availableStock ? T.red : T.green,
                margin: "5px 0 0",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {availableStock}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={setField("notes")}
              style={{
                ...inputStyle(),
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </Field>
        </div>

        {selectedProduct && selectedSource && selectedDestination && (
          <div
            style={{
              ...card(),
              marginTop: 16,
              padding: 14,
              background: T.bg2,
            }}
          >
            <p style={{ color: T.textMut, margin: 0, fontSize: 10 }}>
              TRANSFER PREVIEW
            </p>
            <p style={{ color: T.text, margin: "6px 0 0", fontWeight: 900 }}>
              {selectedProduct.product_name}
            </p>
            <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
              {selectedSource.store_name} → {selectedDestination.store_name}
            </p>
            <p style={{ color: T.accent, margin: "6px 0 0", fontWeight: 900 }}>
              Quantity: {Number(form.quantity || 0)}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>

          <Btn
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Transfer /> {loading ? "Creating..." : "Initiate Transfer"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function StockTransfer() {
  const {
    transfers,
    isLoading,
    isSubmitting,
    isUpdating,
    error,
    clearError,
    fetchTransfers,
    createTransfer,
    updateTransferStatus,
  } = useStockTransferStore();

  const { products, fetchProducts } = useProductStore();
  const { branches, fetchBranches } = useBranchStore();
  const { inventory, fetchInventory } = useInventoryStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    fetchTransfers();
    fetchProducts();
    fetchBranches({ is_active: true });
    fetchInventory();
    clearError?.();
  }, [
    fetchTransfers,
    fetchProducts,
    fetchBranches,
    fetchInventory,
    clearError,
  ]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return transfers.filter((t) => {
      const matchesSearch =
        String(t.transfer_id).includes(q) ||
        t.product?.product_name?.toLowerCase().includes(q) ||
        t.product?.sku?.toLowerCase().includes(q) ||
        t.sourceStore?.store_name?.toLowerCase().includes(q) ||
        t.destStore?.store_name?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      const matchesStore =
        storeFilter === "all" ||
        Number(t.source_store_id) === Number(storeFilter) ||
        Number(t.destination_store_id) === Number(storeFilter);

      return matchesSearch && matchesStatus && matchesStore;
    });
  }, [transfers, search, statusFilter, storeFilter]);

  const pending = transfers.filter((t) => t.status === "pending").length;
  const inTransit = transfers.filter((t) => t.status === "in_transit").length;
  const completedQty = transfers
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.quantity || 0), 0);

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((t) => t.transfer_id)),
    );
  };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async (payload) => {
    try {
      await createTransfer(payload);
      setShowNewModal(false);
      await fetchInventory();
    } catch {}
  };

  const handleStatus = async (id, status) => {
    try {
      await updateTransferStatus(id, { status });
      await fetchInventory();
    } catch {}
  };

  const bulkApprove = async () => {
    for (const id of selected) {
      await handleStatus(id, "approved");
    }
    setSelected(new Set());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          ["Total Transfers", transfers.length, T.blue, "🔄"],
          ["Pending Approval", pending, T.yellow, "⏳"],
          ["In Transit", inTransit, T.blue, "🚛"],
          ["Units Moved", completedQty, T.green, "📦"],
        ].map(([label, value, color, icon]) => (
          <div
            key={label}
            style={{
              ...card(),
              padding: "14px 16px",
              borderLeft: `4px solid ${color}`,
            }}
          >
            <p
              style={{
                color: T.textSub,
                fontSize: 10,
                margin: 0,
                fontWeight: 800,
              }}
            >
              {label.toUpperCase()}
            </p>
            <p
              style={{
                color,
                fontSize: 22,
                fontWeight: 900,
                margin: "6px 0 0",
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
          placeholder="Search transfer, product, SKU, store..."
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Stores</option>
          {branches.map((b) => (
            <option key={b.store_id} value={b.store_id}>
              {b.store_name}
            </option>
          ))}
        </select>

        <Btn onClick={() => setShowNewModal(true)}>
          <Ic.Transfer /> New Transfer
        </Btn>
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

      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: 12,
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
            onClick={bulkApprove}
            disabled={isUpdating}
          >
            <Ic.Check /> Bulk Approve
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              color: T.textMut,
              cursor: "pointer",
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 2fr 1.5fr 1.5fr .8fr 1fr 1fr",
            gap: 10,
            padding: "12px 14px",
            background: T.bg2,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <input
            type="checkbox"
            checked={selected.size === filtered.length && filtered.length > 0}
            onChange={toggleAll}
          />
          {[
            "TRF ID",
            "Product",
            "From",
            "To",
            "Qty",
            "Status",
            "Date",
            "Actions",
          ].map((h) => (
            <b key={h} style={{ color: T.textMut, fontSize: 10 }}>
              {h.toUpperCase()}
            </b>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: 34, textAlign: "center", color: T.textSub }}>
            Loading transfers...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 44, textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>🔄</div>
            <p style={{ color: T.textSub, fontWeight: 700 }}>
              No stock transfers found
            </p>
            <Btn onClick={() => setShowNewModal(true)}>
              <Ic.Plus /> Create First Transfer
            </Btn>
          </div>
        ) : (
          filtered.map((t) => (
            <TransferRow
              key={t.transfer_id}
              transfer={t}
              selected={selected.has(t.transfer_id)}
              onToggle={() => toggle(t.transfer_id)}
              onStatus={handleStatus}
              updating={isUpdating}
            />
          ))
        )}
      </div>

      {showNewModal && (
        <NewTransferModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreate}
          loading={isSubmitting}
          error={error}
          products={products}
          branches={branches}
          inventory={inventory}
        />
      )}
    </div>
  );
}

function TransferRow({ transfer, selected, onToggle, onStatus, updating }) {
  const status = transfer.status;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr 2fr 1.5fr 1.5fr .8fr 1fr 1fr",
        gap: 10,
        padding: "13px 14px",
        borderBottom: `1px solid ${T.border}`,
        alignItems: "center",
        background: selected ? "rgba(172,82,8,.06)" : "transparent",
      }}
    >
      <input type="checkbox" checked={selected} onChange={onToggle} />

      <div
        style={{ color: T.accent, fontWeight: 900, fontFamily: "monospace" }}
      >
        TRF-{transfer.transfer_id}
      </div>

      <div>
        <p style={{ color: T.text, margin: 0, fontWeight: 800, fontSize: 12 }}>
          {transfer.product?.product_name || "Product"}
        </p>
        <p style={{ color: T.textMut, margin: "3px 0 0", fontSize: 10 }}>
          {transfer.product?.sku || "—"}
        </p>
      </div>

      <div style={{ color: T.textSub, fontSize: 12 }}>
        {transfer.sourceStore?.store_name || "—"}
      </div>

      <div style={{ color: T.textSub, fontSize: 12 }}>
        {transfer.destStore?.store_name || "—"}
      </div>

      <div style={{ color: T.blue, fontWeight: 900 }}>{transfer.quantity}</div>

      <Badge color={statusColor(status)} small>
        {status?.replace("_", " ").toUpperCase()}
      </Badge>

      <div>
        <p style={{ color: T.textSub, margin: 0, fontSize: 11 }}>
          {transfer.initiated_date
            ? new Date(transfer.initiated_date).toLocaleDateString()
            : "—"}
        </p>
        {transfer.completed_date && (
          <p style={{ color: T.green, margin: "3px 0 0", fontSize: 10 }}>
            Done: {new Date(transfer.completed_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {status === "pending" && (
          <>
            <MiniBtn
              color={T.green}
              onClick={() => onStatus(transfer.transfer_id, "approved")}
              disabled={updating}
              title="Approve"
            >
              <Ic.Check />
            </MiniBtn>
            <MiniBtn
              color={T.red}
              onClick={() => onStatus(transfer.transfer_id, "rejected")}
              disabled={updating}
              title="Reject"
            >
              <Ic.Close />
            </MiniBtn>
          </>
        )}

        {status === "approved" && (
          <MiniTextBtn
            onClick={() => onStatus(transfer.transfer_id, "in_transit")}
            disabled={updating}
          >
            Ship
          </MiniTextBtn>
        )}

        {status === "in_transit" && (
          <MiniTextBtn
            onClick={() => onStatus(transfer.transfer_id, "completed")}
            disabled={updating}
          >
            Receive
          </MiniTextBtn>
        )}

        {(status === "approved" || status === "in_transit") && (
          <MiniBtn
            color={T.red}
            onClick={() => onStatus(transfer.transfer_id, "cancelled")}
            disabled={updating}
            title="Cancel"
          >
            <Ic.Close />
          </MiniBtn>
        )}
      </div>
    </div>
  );
}

function MiniBtn({ children, color, ...props }) {
  return (
    <button
      {...props}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: `${color}18`,
        color,
        cursor: props.disabled ? "not-allowed" : "pointer",
        display: "grid",
        placeItems: "center",
        opacity: props.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

function MiniTextBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "6px 9px",
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: "rgba(96,165,250,.12)",
        color: T.blue,
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontSize: 11,
        fontWeight: 900,
        opacity: props.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: T.textSub,
          fontSize: 11,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}
