import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useInventoryStore } from "../../store/inventoryStore";
import { useProductStore } from "../../store/productStore";
import { useBranchStore } from "../../store/branchStore";

const EMPTY_FORM = {
  store_id: "",
  product_id: "",
  quantity: "",
  minimum_stock: "",
  maximum_stock: "",
  location_in_store: "",
  valuation_price: "",
};

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

const getStockStatus = (quantity, minimum) => {
  const qty = Number(quantity || 0);
  const min = Number(minimum || 0);

  if (qty === 0) return "out";
  if (min > 0 && qty <= min) return "low";
  if (min > 0 && qty <= min * 1.5) return "warning";
  return "healthy";
};

const statusMap = {
  out: { label: "OUT", color: "red" },
  low: { label: "LOW", color: "red" },
  warning: { label: "WARNING", color: "yellow" },
  healthy: { label: "HEALTHY", color: "green" },
};

export default function StockOverview() {
  const {
    inventory,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchInventory,
    createInventory,
    updateInventory,
    deleteInventory,
  } = useInventoryStore();

  const { products, fetchProducts } = useProductStore();
  const { branches, fetchBranches } = useBranchStore();

  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [activeInventory, setActiveInventory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchBranches();
    clearError();
  }, [fetchInventory, fetchProducts, fetchBranches, clearError]);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const productName = item.product?.product_name || "";
      const sku = item.product?.sku || "";
      const storeName = item.store?.store_name || "";
      const q = search.toLowerCase();

      const matchesSearch =
        productName.toLowerCase().includes(q) ||
        sku.toLowerCase().includes(q) ||
        storeName.toLowerCase().includes(q);

      const matchesStore =
        storeFilter === "all" || Number(item.store_id) === Number(storeFilter);

      const status = getStockStatus(item.quantity, item.minimum_stock);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStore && matchesStatus;
    });
  }, [inventory, search, storeFilter, statusFilter]);

  const totalItems = inventory.length;
  const totalQty = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const lowStock = inventory.filter((item) => {
    const s = getStockStatus(item.quantity, item.minimum_stock);
    return s === "low" || s === "out";
  }).length;
  const totalValue = inventory.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.valuation_price || item.product?.cost_price || 0),
    0,
  );

  const openCreate = () => {
    setModal("create");
    setActiveInventory(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const openEdit = (item) => {
    setModal("edit");
    setActiveInventory(item);
    setForm({
      store_id: item.store_id ? String(item.store_id) : "",
      product_id: item.product_id ? String(item.product_id) : "",
      quantity: item.quantity ?? "",
      minimum_stock: item.minimum_stock ?? "",
      maximum_stock: item.maximum_stock ?? "",
      location_in_store: item.location_in_store || "",
      valuation_price: item.valuation_price ?? "",
    });
    setFormError("");
    clearError();
  };

  const openDelete = (item) => {
    setModal("delete");
    setActiveInventory(item);
    setFormError("");
    clearError();
  };

  const closeModal = () => {
    setModal(null);
    setActiveInventory(null);
    setForm(EMPTY_FORM);
    setFormError("");
    clearError();
  };

  const validate = () => {
    if (!form.store_id) return "Store is required";
    if (!form.product_id) return "Product is required";
    if (form.quantity !== "" && Number(form.quantity) < 0)
      return "Quantity cannot be negative";
    if (form.minimum_stock !== "" && Number(form.minimum_stock) < 0)
      return "Minimum stock cannot be negative";
    if (form.maximum_stock !== "" && Number(form.maximum_stock) < 0)
      return "Maximum stock cannot be negative";
    if (form.valuation_price !== "" && Number(form.valuation_price) <= 0)
      return "Valuation price must be positive";
    return "";
  };

  const buildPayload = () => ({
    store_id: Number(form.store_id),
    product_id: Number(form.product_id),
    quantity: form.quantity === "" ? 0 : Number(form.quantity),
    minimum_stock: form.minimum_stock === "" ? 0 : Number(form.minimum_stock),
    maximum_stock:
      form.maximum_stock === "" ? null : Number(form.maximum_stock),
    location_in_store: form.location_in_store?.trim() || null,
    valuation_price:
      form.valuation_price === "" ? null : Number(form.valuation_price),
  });

  const handleCreate = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      await createInventory(buildPayload());
      closeModal();
    } catch {
      setFormError(
        useInventoryStore.getState().error || "Failed to create inventory",
      );
    }
  };

  const handleUpdate = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      await updateInventory(activeInventory.inventory_id, buildPayload());
      closeModal();
    } catch {
      setFormError(
        useInventoryStore.getState().error || "Failed to update inventory",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInventory(activeInventory.inventory_id);
      closeModal();
    } catch {}
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
          ["Inventory Records", totalItems, "📦", T.accent],
          ["Total Quantity", totalQty, "📊", T.green],
          ["Low / Out Stock", lowStock, "⚠️", T.red],
          ["Stock Value", money(totalValue), "💰", T.blue],
        ].map(([label, value, icon, color]) => (
          <div
            key={label}
            style={{ ...card(), padding: 16, borderLeft: `4px solid ${color}` }}
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
                color: T.text,
                margin: "7px 0 0",
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
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, SKU, store..."
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="">All Stores</option>
          <option value="all">All Stores</option>
          {branches.map((b) => (
            <option key={b.store_id} value={b.store_id}>
              {b.store_name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="warning">Warning</option>
          <option value="low">Low</option>
          <option value="out">Out</option>
        </select>

        <Btn onClick={openCreate}>
          <Ic.Plus /> Add Inventory
        </Btn>
      </div>

      {error && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr .8fr .8fr .8fr 1fr 140px",
            gap: 12,
            padding: "14px 16px",
            background: T.bg2,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {["Product", "Store", "Qty", "Min", "Max", "Status", "Actions"].map(
            (h) => (
              <div
                key={h}
                style={{ color: T.textMut, fontSize: 10, fontWeight: 800 }}
              >
                {h.toUpperCase()}
              </div>
            ),
          )}
        </div>

        {isLoading ? (
          <div style={{ padding: 30, textAlign: "center", color: T.textSub }}>
            Loading inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 44, textAlign: "center" }}>
            <div style={{ fontSize: 46 }}>📦</div>
            <p style={{ color: T.textSub, fontWeight: 700 }}>
              No inventory found
            </p>
            <Btn onClick={openCreate}>
              <Ic.Plus /> Create Inventory
            </Btn>
          </div>
        ) : (
          filtered.map((item) => {
            const status = getStockStatus(item.quantity, item.minimum_stock);
            const s = statusMap[status];

            return (
              <div
                key={item.inventory_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr .8fr .8fr .8fr 1fr 140px",
                  gap: 12,
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  alignItems: "center",
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
                    {item.product?.product_name || "Unknown Product"}
                  </p>
                  <p
                    style={{
                      color: T.accent,
                      margin: "3px 0 0",
                      fontSize: 11,
                      fontFamily: "monospace",
                    }}
                  >
                    {item.product?.sku || "NO-SKU"}
                  </p>
                </div>

                <div>
                  <p style={{ color: T.textSub, margin: 0, fontSize: 12 }}>
                    {item.store?.store_name || "Unknown Store"}
                  </p>
                  <p
                    style={{
                      color: T.textMut,
                      margin: "3px 0 0",
                      fontSize: 10,
                    }}
                  >
                    {item.location_in_store || "No location"}
                  </p>
                </div>

                <div style={{ color: T.text, fontWeight: 900 }}>
                  {item.quantity ?? 0}
                </div>
                <div style={{ color: T.textSub }}>
                  {item.minimum_stock ?? 0}
                </div>
                <div style={{ color: T.textSub }}>
                  {item.maximum_stock ?? "—"}
                </div>

                <div>
                  <Badge color={s.color} small>
                    {s.label}
                  </Badge>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => openEdit(item)}
                    style={iconButton(T.accent)}
                  >
                    <Ic.Edit />
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    style={iconButton(T.red, "rgba(248,113,113,.1)")}
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {(modal === "create" || modal === "edit") && (
        <InventoryModal
          mode={modal}
          form={form}
          setForm={setForm}
          products={products}
          branches={branches}
          error={formError}
          loading={isSubmitting}
          onClose={closeModal}
          onSubmit={modal === "create" ? handleCreate : handleUpdate}
        />
      )}

      {modal === "delete" && activeInventory && (
        <DeleteModal
          item={activeInventory}
          loading={isDeleting}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function InventoryModal({
  mode,
  form,
  setForm,
  products,
  branches,
  error,
  loading,
  onClose,
  onSubmit,
}) {
  const selectedProduct = products.find(
    (p) => Number(p.product_id) === Number(form.product_id),
  );
  const selectedStore = branches.find(
    (b) => Number(b.store_id) === Number(form.store_id),
  );

  const setField = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

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
      <div style={{ ...card(), width: "100%", maxWidth: 760, padding: 22 }}>
        <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
          {mode === "create" ? "Create Inventory" : "Edit Inventory"}
        </h2>

        {error && <p style={{ color: T.red, fontWeight: 700 }}>{error}</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginTop: 18,
          }}
        >
          <Field label="Store *">
            <select
              value={form.store_id}
              onChange={setField("store_id")}
              style={inputStyle()}
            >
              <option value="">Select store</option>
              {branches.map((b) => (
                <option key={b.store_id} value={b.store_id}>
                  {b.store_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Product *">
            <select
              value={form.product_id}
              onChange={setField("product_id")}
              style={inputStyle()}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.sku})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              value={form.quantity}
              onChange={setField("quantity")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Minimum Stock">
            <input
              type="number"
              value={form.minimum_stock}
              onChange={setField("minimum_stock")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Maximum Stock">
            <input
              type="number"
              value={form.maximum_stock}
              onChange={setField("maximum_stock")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Valuation Price">
            <input
              type="number"
              value={form.valuation_price}
              onChange={setField("valuation_price")}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label="Location In Store">
            <input
              value={form.location_in_store}
              onChange={setField("location_in_store")}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div
          style={{ ...card(), padding: 14, marginTop: 16, background: T.bg2 }}
        >
          <p
            style={{
              color: T.textMut,
              margin: "0 0 8px",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            FULL PREVIEW
          </p>
          <p style={{ color: T.text, margin: 0, fontWeight: 800 }}>
            {selectedProduct?.product_name || "No Product"} →{" "}
            {selectedStore?.store_name || "No Store"}
          </p>
          <p style={{ color: T.textSub, margin: "6px 0 0", fontSize: 12 }}>
            SKU: {selectedProduct?.sku || "—"} • Qty: {form.quantity || 0} •
            Min: {form.minimum_stock || 0}
          </p>
          <p
            style={{
              color: T.accent,
              margin: "6px 0 0",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Value:{" "}
            {money(
              Number(form.quantity || 0) *
                Number(
                  form.valuation_price || selectedProduct?.cost_price || 0,
                ),
            )}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <Btn
            onClick={onSubmit}
            disabled={loading}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Inventory"
                : "Save Changes"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ item, loading, onClose, onConfirm }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.82)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ ...card(), width: 400, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 42 }}>🗑️</div>
        <h3 style={{ color: T.text }}>Delete Inventory?</h3>
        <p style={{ color: T.textSub }}>
          {item.product?.product_name} from {item.store?.store_name}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 9,
              background: "#dc2626",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          color: T.textSub,
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
  };
}

function iconButton(color, bg = "rgba(172,82,8,.12)") {
  return {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${T.border}`,
    background: bg,
    color,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  };
}
