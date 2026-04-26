import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useProductStore } from "../../store/productStore";
import { useSupplierStore } from "../../store/supplierStore";
import { useBranchStore } from "../../store/branchStore";
import { usePurchaseStore } from "../../store/purchaseStore";

const EMPTY_ITEM = {
  product_id: "",
  quantity_ordered: 1,
  quantity_received: 0,
  unit_cost: "",
  discount_amount: 0,
};

const EMPTY_FORM = {
  store_id: "",
  supplier_id: "",
  expected_delivery: "",
  received_date: "",
  discount_type: "fixed",
  discount_value: 0,
  tax_amount: 0,
  payment_status: "pending",
  payment_method: "cash",
  paid_amount: 0,
  payment_terms: "",
  status: "ordered",
  notes: "",
  items: [{ ...EMPTY_ITEM }],
};

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function NewPurchase() {
  const { products, fetchProducts } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const { branches, fetchBranches } = useBranchStore();
  const { createPurchase, isSubmitting, error, clearError } =
    usePurchaseStore();

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers({ is_active: true });
    fetchBranches({ is_active: true });
    clearError?.();
  }, [fetchProducts, fetchSuppliers, fetchBranches, clearError]);

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setFormError("");
  };

  const updateItem = (index, key, value) => {
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const handleProductChange = (index, productId) => {
    const product = products.find(
      (p) => Number(p.product_id) === Number(productId),
    );

    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === index
          ? {
              ...item,
              product_id: productId,
              unit_cost: product?.cost_price || "",
            }
          : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((p) => ({ ...p, items: [...p.items, { ...EMPTY_ITEM }] }));
  };

  const removeItem = (index) => {
    setForm((p) => ({
      ...p,
      items:
        p.items.length === 1 ? p.items : p.items.filter((_, i) => i !== index),
    }));
  };

  const detailedItems = useMemo(() => {
    return form.items.map((item) => {
      const qty = Number(item.quantity_ordered || 0);
      const received = Number(item.quantity_received || 0);
      const cost = Number(item.unit_cost || 0);
      const discount = Number(item.discount_amount || 0);
      const subtotal = qty * cost;
      const finalUnitCost =
        qty > 0 ? Math.max(0, (subtotal - discount) / qty) : cost;

      return {
        ...item,
        quantity_ordered: qty,
        quantity_received: received,
        unit_cost: cost,
        discount_amount: discount,
        subtotal,
        final_unit_cost: finalUnitCost,
      };
    });
  }, [form.items]);

  const totals = useMemo(() => {
    const subtotal = detailedItems.reduce((s, i) => s + i.subtotal, 0);
    const discountValue = Number(form.discount_value || 0);

    const discountAmount =
      form.discount_type === "percentage"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const taxAmount = Number(form.tax_amount || 0);
    const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);
    const paidAmount = Number(form.paid_amount || 0);
    const dueAmount = Math.max(0, totalAmount - paidAmount);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      paidAmount,
      dueAmount,
    };
  }, [
    detailedItems,
    form.discount_type,
    form.discount_value,
    form.tax_amount,
    form.paid_amount,
  ]);

  const toISO = (v) => (v ? new Date(v).toISOString() : null);

  const validate = () => {
    if (!form.store_id) return "Store is required";
    if (!form.supplier_id) return "Supplier is required";

    for (const item of form.items) {
      if (!item.product_id) return "Every item needs a product";
      if (Number(item.quantity_ordered) <= 0)
        return "Quantity ordered must be greater than 0";
      if (Number(item.quantity_received) < 0)
        return "Quantity received cannot be negative";
      if (item.unit_cost === "" || Number(item.unit_cost) < 0)
        return "Unit cost is required";
    }

    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      const payload = {
        store_id: Number(form.store_id),
        supplier_id: Number(form.supplier_id),
        expected_delivery: toISO(form.expected_delivery),
        received_date: toISO(form.received_date),
        subtotal: totals.subtotal,
        discount_type: form.discount_type || null,
        discount_value: Number(form.discount_value || 0),
        discount_amount: totals.discountAmount,
        tax_amount: totals.taxAmount,
        total_amount: totals.totalAmount,
        payment_status: form.payment_status,
        payment_method: form.payment_method,
        paid_amount: totals.paidAmount,
        due_amount: totals.dueAmount,
        payment_terms: form.payment_terms || null,
        status: form.status || null,
        notes: form.notes || null,
        items: detailedItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity_ordered: item.quantity_ordered,
          quantity_received: item.quantity_received,
          unit_cost: item.unit_cost,
          discount_amount: item.discount_amount,
          final_unit_cost: item.final_unit_cost,
          subtotal: item.subtotal,
        })),
      };

      const purchase = await createPurchase(payload);
      setSaved(purchase);
      setForm(EMPTY_FORM);
    } catch {}
  };

  if (saved) {
    return (
      <div style={{ minHeight: 460, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60 }}>✅</div>
          <h2 style={{ color: T.text, fontWeight: 900 }}>Purchase Created</h2>
          <p style={{ color: T.textSub }}>
            PO Number:{" "}
            <strong style={{ color: T.accent }}>{saved.po_number}</strong>
          </p>
          <Btn onClick={() => setSaved(null)}>
            <Ic.Plus /> Create Another
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
      <div style={{ ...card(), padding: 20 }}>
        <h2 style={{ color: T.text, marginTop: 0 }}>New Purchase</h2>

        {(formError || error) && (
          <div style={{ color: T.red, marginBottom: 12, fontWeight: 800 }}>
            {formError || error}
          </div>
        )}

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
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

          <Field label="Supplier *">
            <select
              value={form.supplier_id}
              onChange={setField("supplier_id")}
              style={inputStyle()}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Expected Delivery">
            <input
              type="datetime-local"
              value={form.expected_delivery}
              onChange={setField("expected_delivery")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Received Date">
            <input
              type="datetime-local"
              value={form.received_date}
              onChange={setField("received_date")}
              style={inputStyle()}
            />
          </Field>
        </div>

        <h3 style={{ color: T.text, marginTop: 22 }}>Items</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {form.items.map((item, index) => (
            <div
              key={index}
              style={{ ...card(), padding: 14, background: T.bg3 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.7fr .8fr .8fr .8fr auto",
                  gap: 10,
                }}
              >
                <Field label="Product *">
                  <select
                    value={item.product_id}
                    onChange={(e) => handleProductChange(index, e.target.value)}
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

                <Field label="Ordered *">
                  <input
                    type="number"
                    value={item.quantity_ordered}
                    onChange={(e) =>
                      updateItem(index, "quantity_ordered", e.target.value)
                    }
                    style={inputStyle()}
                  />
                </Field>

                <Field label="Received">
                  <input
                    type="number"
                    value={item.quantity_received}
                    onChange={(e) =>
                      updateItem(index, "quantity_received", e.target.value)
                    }
                    style={inputStyle()}
                  />
                </Field>

                <Field label="Unit Cost *">
                  <input
                    type="number"
                    value={item.unit_cost}
                    onChange={(e) =>
                      updateItem(index, "unit_cost", e.target.value)
                    }
                    style={inputStyle()}
                  />
                </Field>

                <button onClick={() => removeItem(index)} style={deleteBtn()}>
                  <Ic.Trash />
                </button>
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                <Field label="Item Discount">
                  <input
                    type="number"
                    value={item.discount_amount}
                    onChange={(e) =>
                      updateItem(index, "discount_amount", e.target.value)
                    }
                    style={inputStyle()}
                  />
                </Field>

                <InfoBox
                  label="Subtotal"
                  value={money(detailedItems[index].subtotal)}
                />
                <InfoBox
                  label="Final Unit Cost"
                  value={money(detailedItems[index].final_unit_cost)}
                />
              </div>
            </div>
          ))}
        </div>

        <Btn variant="ghost" onClick={addItem} style={{ marginTop: 12 }}>
          <Ic.Plus /> Add Item
        </Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...card(), padding: 18 }}>
          <h3 style={{ color: T.text, marginTop: 0 }}>Payment</h3>

          <Field label="Discount Type">
            <select
              value={form.discount_type}
              onChange={setField("discount_type")}
              style={inputStyle()}
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </select>
          </Field>

          <Field label="Discount Value">
            <input
              type="number"
              value={form.discount_value}
              onChange={setField("discount_value")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Tax Amount">
            <input
              type="number"
              value={form.tax_amount}
              onChange={setField("tax_amount")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Payment Status">
            <select
              value={form.payment_status}
              onChange={setField("payment_status")}
              style={inputStyle()}
            >
              {[
                "pending",
                "partial",
                "paid",
                "failed",
                "refunded",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Paid Amount">
            <input
              type="number"
              value={form.paid_amount}
              onChange={setField("paid_amount")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Payment Method">
            <select
              value={form.payment_method}
              onChange={setField("payment_method")}
              style={inputStyle()}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
          </Field>

          <Field label="Payment Terms">
            <input
              value={form.payment_terms}
              onChange={setField("payment_terms")}
              style={inputStyle()}
            />
          </Field>

          <Field label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={setField("notes")}
              style={textareaStyle()}
            />
          </Field>
        </div>

        <div style={{ ...card(), padding: 18 }}>
          <h3 style={{ color: T.text, marginTop: 0 }}>Summary</h3>
          <Total label="Subtotal" value={money(totals.subtotal)} />
          <Total label="Discount" value={`- ${money(totals.discountAmount)}`} />
          <Total label="Tax" value={money(totals.taxAmount)} />
          <hr style={{ borderColor: "var(--border)" }} />
          <Total label="Total" value={money(totals.totalAmount)} strong />
          <Total label="Paid" value={money(totals.paidAmount)} />
          <Total label="Due" value={money(totals.dueAmount)} />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: T.accent,
              color: "#fff",
              fontWeight: 900,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Creating..." : "Create Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
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

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: T.bg2,
        border: `1px solid ${T.border}`,
      }}
    >
      <p style={{ color: T.textMut, margin: 0, fontSize: 10 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ color: T.text, margin: "4px 0 0", fontWeight: 900 }}>
        {value}
      </p>
    </div>
  );
}

function Total({ label, value, strong }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
      }}
    >
      <span
        style={{
          color: strong ? T.text : T.textSub,
          fontWeight: strong ? 900 : 600,
        }}
      >
        {label}
      </span>
      <span style={{ color: strong ? T.green : T.text, fontWeight: 900 }}>
        {value}
      </span>
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

function textareaStyle() {
  return { ...inputStyle(), resize: "vertical", fontFamily: "inherit" };
}

function deleteBtn() {
  return {
    width: 40,
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    border: "1px solid rgba(248,113,113,.25)",
    background: "rgba(248,113,113,.08)",
    color: T.red,
    cursor: "pointer",
  };
}
