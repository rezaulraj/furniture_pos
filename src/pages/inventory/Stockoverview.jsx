import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useInventoryStore } from "../../store/inventoryStore";
import { useProductStore } from "../../store/productStore";
import { useBranchStore } from "../../store/branchStore";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

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

export default function StockOverview() {
  const { t } = useLanguageStore();
  const {
    inventory,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchInventory,
    createInventory,
    addStock,
    updateInventory,
    deleteInventory,
  } = useInventoryStore();

  const statusMap = {
    out: { label: t("out").toUpperCase(), color: "red" },
    low: { label: t("low").toUpperCase(), color: "red" },
    warning: { label: t("warning").toUpperCase(), color: "yellow" },
    healthy: { label: t("healthy").toUpperCase(), color: "green" },
  };

  const { products, fetchProducts } = useProductStore();
  const { branches, fetchBranches } = useBranchStore();

  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [modal, setModal] = useState(null);
  const [activeInventory, setActiveInventory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = { page, limit: 10, search };
    if (storeFilter !== "all") params.store_id = storeFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    fetchInventory(params);
    fetchProducts();
    fetchBranches();
    clearError();
  }, [page, search, storeFilter, statusFilter, fetchInventory, fetchProducts, fetchBranches, clearError]);

  const filtered = inventory;

  const totalItems = inventory.length;
  const totalQty = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const lowStockCount = inventory.filter((item) => {
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

  const openAddStock = (item) => {
    setModal("add-stock");
    setActiveInventory(item);
    setForm({ ...EMPTY_FORM, quantity: 1 });
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
    if (!form.store_id) return t("storeRequired");
    if (!form.product_id) return t("productRequired");
    if (form.quantity !== "" && Number(form.quantity) < 0)
      return t("qtyCannotBeNegative");
    if (form.minimum_stock !== "" && Number(form.minimum_stock) < 0)
      return t("minStockNegative");
    if (form.maximum_stock !== "" && Number(form.maximum_stock) < 0)
      return t("maxStockNegative");
    if (form.valuation_price !== "" && Number(form.valuation_price) <= 0)
      return t("valuationPricePositive");
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
        useInventoryStore.getState().error || t("failedToCreateInventory"),
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
        useInventoryStore.getState().error || t("failedToUpdateInventory"),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInventory(activeInventory.inventory_id);
      closeModal();
    } catch {}
  };

  const handleAddStock = async () => {
    if (!form.quantity || Number(form.quantity) < 1) {
      return setFormError(t("qtyAtLeastOne"));
    }

    try {
      await addStock({
        store_id: activeInventory.store_id,
        product_id: activeInventory.product_id,
        quantity: Number(form.quantity),
      });
      closeModal();
    } catch {
      setFormError(useInventoryStore.getState().error || t("failedToAddStock"));
    }
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
          [t("inventoryRecords"), totalItems, "📦", T.accent],
          [t("totalQuantity"), totalQty, "📊", T.green],
          [t("lowOutStock"), lowStockCount, "⚠️", T.red],
          [t("stockValue"), money(totalValue), "💰", T.blue],
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
          placeholder={t("searchInventory")}
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allStores")}</option>
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
          <option value="all">{t("allStatus")}</option>
          <option value="healthy">{t("healthy")}</option>
          <option value="warning">{t("warning")}</option>
          <option value="low">{t("low")}</option>
          <option value="out">{t("out")}</option>
        </select>

        <div
          style={{
            display: "flex",
            gap: 4,
            background: T.bg3,
            padding: 4,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            style={viewBtnStyle(viewMode === "grid")}
          >
            <Ic.LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={viewBtnStyle(viewMode === "table")}
          >
            <Ic.List size={18} />
          </button>
        </div>

        <Btn onClick={openCreate}>
          <Ic.Plus /> {t("addInventory")}
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

      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 14,
          }}
        >
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ ...card(), minHeight: 200, opacity: 0.6 }} />
            ))
          ) : filtered.length === 0 ? (
            <div
              style={{
                ...card(),
                padding: 40,
                gridColumn: "1/-1",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 46 }}>📦</div>
              <p style={{ color: T.textSub, fontWeight: 700 }}>
                {t("noInventoryFound")}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const status = getStockStatus(item.quantity, item.minimum_stock);
              const s = statusMap[status];

              return (
                <div
                  key={item.inventory_id}
                  style={{
                    ...card(),
                    padding: 18,
                    borderTop: `3px solid ${
                      s.color === "green"
                        ? T.green
                        : s.color === "yellow"
                          ? T.accent
                          : T.red
                    }`,
                  }}
                >
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
                          color: T.text,
                          margin: 0,
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {item.product?.product_name}
                      </p>
                      <p
                        style={{
                          color: T.accent,
                          fontSize: 11,
                          fontFamily: "monospace",
                          margin: "3px 0 0",
                        }}
                      >
                        {item.product?.sku}
                      </p>
                    </div>
                    <Badge color={s.color} small>
                      {s.label}
                    </Badge>
                  </div>

                  <div
                    style={{
                      margin: "14px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <InfoLine label={t("store")} value={item.store?.store_name} />
                    <InfoLine
                      label={t("location")}
                      value={item.location_in_store || t("noLocation")}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: T.bg3,
                        padding: "8px 10px",
                        borderRadius: 8,
                        marginTop: 4,
                      }}
                    >
                      <div>
                        <p
                          style={{ color: T.textMut, fontSize: 10, margin: 0 }}
                        >
                          {t("qty").toUpperCase()}
                        </p>
                        <p
                          style={{ color: T.text, fontWeight: 900, margin: 0 }}
                        >
                          {item.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{ color: T.textMut, fontSize: 10, margin: 0 }}
                        >
                          {t("min").toUpperCase()} / {t("max").toUpperCase()}
                        </p>
                        <p
                          style={{ color: T.textSub, fontWeight: 700, margin: 0 }}
                        >
                          {item.minimum_stock} / {item.maximum_stock || "∞"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      paddingTop: 12,
                      borderTop: `1px solid ${T.border}`,
                    }}
                  >
                    <button
                      onClick={() => openAddStock(item)}
                      style={{ ...actionBtnStyle(T.green, "rgba(34,197,94,.1)"), flex: 1 }}
                    >
                      <Ic.Plus size={16} /> {t("add")}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      style={{ ...actionBtnStyle(T.accent, "rgba(172,82,8,.1)"), flex: 1 }}
                    >
                      <Ic.Edit size={16} /> {t("edit")}
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      style={{ ...actionBtnStyle(T.red, "rgba(248,113,113,.1)"), flex: 1 }}
                    >
                      <Ic.Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {viewMode === "table" && (
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
            {[
              t("product"),
              t("store"),
              t("qty"),
              t("min"),
              t("max"),
              t("status"),
              t("action"),
            ].map((h) => (
              <div
                key={h}
                style={{ color: T.textMut, fontSize: 10, fontWeight: 800 }}
              >
                {h.toUpperCase()}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: 30, textAlign: "center", color: T.textSub }}>
              {t("loading")}...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 44, textAlign: "center" }}>
              <div style={{ fontSize: 46 }}>📦</div>
              <p style={{ color: T.textSub, fontWeight: 700 }}>
                {t("noInventoryFound")}
              </p>
              <Btn onClick={openCreate}>
                <Ic.Plus /> {t("createInventory")}
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
                      {item.product?.product_name || t("unknownProduct")}
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
                      {item.store?.store_name || t("unknownStore")}
                    </p>
                    <p
                      style={{
                        color: T.textMut,
                        margin: "3px 0 0",
                        fontSize: 10,
                      }}
                    >
                      {item.location_in_store || t("noLocation")}
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
                      onClick={() => openAddStock(item)}
                      style={iconButtonStyle(T.green, "rgba(34,197,94,.12)")}
                      title={t("addStock")}
                    >
                      <Ic.Plus />
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      style={iconButtonStyle(T.accent)}
                      title={t("edit")}
                    >
                      <Ic.Edit />
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      style={iconButtonStyle(T.red, "rgba(248,113,113,.1)")}
                      title={t("delete")}
                    >
                      <Ic.Trash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <Pagination
        meta={useInventoryStore.getState().pagination}
        onPageChange={(p) => setPage(p)}
      />

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

      {modal === "add-stock" && activeInventory && (
        <AddStockModal
          item={activeInventory}
          form={form}
          setForm={setForm}
          loading={isSubmitting}
          error={formError}
          onClose={closeModal}
          onSubmit={handleAddStock}
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
  const { t } = useLanguageStore();
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
          {mode === "create" ? t("createInventory") : t("editInventory")}
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
          <Field label={`${t("store")} *`}>
            <select
              value={form.store_id}
              onChange={setField("store_id")}
              style={inputStyle()}
            >
              <option value="">{t("selectStore")}</option>
              {branches.map((b) => (
                <option key={b.store_id} value={b.store_id}>
                  {b.store_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={`${t("product")} *`}>
            <select
              value={form.product_id}
              onChange={setField("product_id")}
              style={inputStyle()}
            >
              <option value="">{t("selectProduct")}</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.sku})
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("qty")}>
            <input
              type="number"
              value={form.quantity}
              onChange={setField("quantity")}
              style={inputStyle()}
            />
          </Field>

          <Field label={t("min") + " " + t("stock")}>
            <input
              type="number"
              value={form.minimum_stock}
              onChange={setField("minimum_stock")}
              style={inputStyle()}
            />
          </Field>

          <Field label={t("max") + " " + t("stock")}>
            <input
              type="number"
              value={form.maximum_stock}
              onChange={setField("maximum_stock")}
              style={inputStyle()}
            />
          </Field>

          <Field label={t("valuationPrice")}>
            <input
              type="number"
              value={form.valuation_price}
              onChange={setField("valuation_price")}
              style={inputStyle()}
            />
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <Field label={t("locationInStore")}>
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
            {t("fullPreview").toUpperCase()}
          </p>
          <p style={{ color: T.text, margin: 0, fontWeight: 800 }}>
            {selectedProduct?.product_name || t("noData")} →{" "}
            {selectedStore?.store_name || t("noData")}
          </p>
          <p style={{ color: T.textSub, margin: "6px 0 0", fontSize: 12 }}>
            SKU: {selectedProduct?.sku || "—"} • {t("qty")}: {form.quantity || 0} •
            {t("min")}: {form.minimum_stock || 0}
          </p>
          <p
            style={{
              color: T.accent,
              margin: "6px 0 0",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {t("value")}:{" "}
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
            {t("cancel")}
          </Btn>
          <Btn
            onClick={onSubmit}
            disabled={loading}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loading
              ? t("saving")
              : mode === "create"
                ? t("createInventory")
                : t("saveChanges")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ item, loading, onClose, onConfirm }) {
  const { t } = useLanguageStore();
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
        <h3 style={{ color: T.text }}>{t("deleteInventoryQuestion")}</h3>
        <p style={{ color: T.textSub }}>
          {item.product?.product_name} {t("from")} {item.store?.store_name}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {t("cancel")}
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
            {loading ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddStockModal({
  item,
  form,
  setForm,
  loading,
  error,
  onClose,
  onSubmit,
}) {
  const { t } = useLanguageStore();
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
      <div style={{ ...card(), width: "100%", maxWidth: 420, padding: 24 }}>
        <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>{t("addStock")}</h2>
        <p style={{ color: T.textSub, margin: "6px 0 16px", fontSize: 13 }}>
          {t("addingStockFor")} <b>{item.product?.product_name}</b> {t("at")}{" "}
          <b>{item.store?.store_name}</b>
        </p>

        {error && (
          <p style={{ color: T.red, fontWeight: 700, fontSize: 12 }}>{error}</p>
        )}

        <div style={{ marginTop: 12 }}>
          <Field label={t("quantityToAdd")}>
            <input
              type="number"
              autoFocus
              value={form.quantity}
              onChange={(e) =>
                setForm((p) => ({ ...p, quantity: e.target.value }))
              }
              style={inputStyle()}
              placeholder={t("enterQuantity")}
            />
          </Field>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {t("cancel")}
          </Btn>
          <Btn
            onClick={onSubmit}
            disabled={loading}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loading ? t("saving") : t("addStock")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
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

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "11px 12px",
    color: T.text,
    outline: "none",
  };
}

function iconButtonStyle(color, bg = "rgba(172,82,8,.1)") {
  return {
    width: 32,
    height: 32,
    borderRadius: 9,
    border: `1px solid ${T.border}`,
    background: bg,
    color,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all .2s",
  };
}

function actionBtnStyle(color, bg) {
  return {
    height: 34,
    padding: "0 10px",
    borderRadius: 8,
    background: bg,
    border: `1px solid ${T.border}`,
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    transition: "all .2s",
  };
}

function viewBtnStyle(active) {
  return {
    width: 36,
    height: 36,
    borderRadius: 9,
    border: "none",
    background: active ? T.accent : "transparent",
    color: active ? "#fff" : T.textMut,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all .2s",
  };
}

function InfoLine({ label, value, strong, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span style={{ color: T.textMut, fontSize: 11.5 }}>{label}</span>
      <span
        style={{
          color: color || (strong ? T.text : T.textSub),
          fontSize: 11.5,
          fontWeight: strong ? 900 : 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
