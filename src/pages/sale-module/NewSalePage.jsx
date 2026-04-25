import { useEffect, useMemo, useRef, useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useProductStore } from "../../store/productStore";
import { useCustomerStore } from "../../store/customerStore";
import { useSaleStore } from "../../store/saleStore";
import { useAuthStore } from "../../store/authStore";
import SaleInvoicePDF from "../../components/SaleInvoicePDF";

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

export default function NewSalePage() {
  const customerDropRef = useRef(null);

  const { user } = useAuthStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductStore();
  const { customers, fetchCustomers, createCustomer } = useCustomerStore();
  const {
    createSale,
    isSubmitting,
    error: saleError,
    clearError,
  } = useSaleStore();

  const [productSearch, setProductSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [customer, setCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showCustomerCreate, setShowCustomerCreate] = useState(false);

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("0");
  const [vat, setVat] = useState("0");
  const [paidAmount, setPaidAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [savedSale, setSavedSale] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    customer_type: "retail",
  });

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    clearError?.();
  }, [fetchProducts, fetchCustomers, clearError]);

  useEffect(() => {
    const h = (e) => {
      if (
        customerDropRef.current &&
        !customerDropRef.current.contains(e.target)
      ) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();

    return products.filter(
      (p) =>
        p.product_name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q),
    );
  }, [products, productSearch]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase();

    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.customer_code?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q),
    );
  }, [customers, customerSearch]);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.unit_price || 0),
    0,
  );

  const discountAmount =
    discountType === "percentage"
      ? (subtotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);

  const taxAmount = Math.round(
    (subtotal - discountAmount) * (Number(vat || 0) / 100),
  );

  const totalAmount = Math.max(
    0,
    Math.round(subtotal - discountAmount + taxAmount),
  );
  const paid = Number(paidAmount || 0);
  const due = Math.max(0, totalAmount - paid);
  const change = paid > totalAmount ? paid - totalAmount : 0;
  const totalQty = selectedItems.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0,
  );

  const addProduct = (product) => {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (item) => item.product_id === product.product_id,
      );

      if (exists) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          product_id: product.product_id,
          product_name: product.product_name,
          sku: product.sku,
          category_name: product.category?.category_name || "No Category",
          unit_price: Number(product.selling_price || 0),
          qty: 1,
          image_url: product.image_url || "",
        },
      ];
    });

    setProductSearch("");
  };

  const updateQty = (productId, qty) => {
    if (Number(qty) < 1) return;

    setSelectedItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, qty: Number(qty) } : item,
      ),
    );
  };

  const removeItem = (productId) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.product_id !== productId),
    );
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const toggleRow = (productId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === selectedItems.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(selectedItems.map((item) => item.product_id)));
    }
  };

  const removeSelected = () => {
    setSelectedItems((prev) =>
      prev.filter((item) => !selectedRows.has(item.product_id)),
    );
    setSelectedRows(new Set());
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.full_name.trim()) {
      setFormError("Customer name is required");
      return;
    }

    try {
      const created = await createCustomer({
        full_name: newCustomer.full_name.trim(),
        phone: newCustomer.phone?.trim() || null,
        email: newCustomer.email?.trim() || null,
        address: newCustomer.address?.trim() || null,
        customer_type: newCustomer.customer_type || "retail",
        is_active: true,
      });

      setCustomer(created);
      setShowCustomerCreate(false);
      setNewCustomer({
        full_name: "",
        phone: "",
        email: "",
        address: "",
        customer_type: "retail",
      });
      setFormError("");
    } catch {
      setFormError("Failed to create customer");
    }
  };

  const validateSale = () => {
    if (!user?.store_id) return "Logged-in user store_id not found";
    if (!selectedItems.length) return "Please add at least one product";
    if (paid < 0) return "Paid amount cannot be negative";
    return "";
  };

  const handleSave = async () => {
    const err = validateSale();
    if (err) {
      setFormError(err);
      return;
    }

    try {
      const paymentStatus =
        due === 0 ? "paid" : paid > 0 ? "partial" : "pending";

      const payload = {
        store_id: Number(user.store_id),
        customer_id: customer?.customer_id || null,
        subtotal,
        discount_type: discountType,
        discount_value: Number(discountValue || 0),
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        payment_status: paymentStatus,
        paid_amount: paid,
        due_amount: due,
        installment_terms: null,
        notes: notes || null,
        items: selectedItems.map((item) => {
          const itemSubtotal = item.qty * item.unit_price;

          return {
            product_id: Number(item.product_id),
            quantity: Number(item.qty),
            unit_price: Number(item.unit_price),
            discount_percent: 0,
            discount_amount: 0,
            final_unit_price: Number(item.unit_price),
            subtotal: itemSubtotal,
          };
        }),
      };

      const res = await createSale(payload);
      const sale = res?.data || res;

      setSavedSale(sale);
      setSelectedItems([]);
      setSelectedRows(new Set());
      setCustomer(null);
      setPaidAmount("");
      setNotes("");
      setFormError("");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.response?.data?.errors ||
          "Sale failed",
      );
    }
  };

  if (savedSale) {
    return (
      <SaleInvoicePDF sale={savedSale} onNewSale={() => setSavedSale(null)} />
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 14,
        height: "calc(100vh - 110px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minWidth: 0,
        }}
      >
        {(formError || saleError) && (
          <div
            style={{
              ...card(),
              padding: "12px 14px",
              color: T.red,
              borderLeft: `4px solid ${T.red}`,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {formError || saleError}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              ...card(),
              flex: 1,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              height: 44,
            }}
          >
            <span style={{ color: T.textMut, display: "flex" }}>
              <Ic.Search />
            </span>
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search product by name or SKU..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: T.text,
                fontSize: 13,
                paddingLeft: 10,
              }}
            />
          </div>

          {selectedRows.size > 0 && (
            <Btn variant="danger" onClick={removeSelected}>
              <Ic.Trash /> Remove {selectedRows.size}
            </Btn>
          )}
        </div>

        {productSearch && (
          <div
            style={{
              ...card(),
              maxHeight: 260,
              overflowY: "auto",
              padding: 8,
            }}
          >
            {productsLoading ? (
              <p style={{ color: T.textSub, padding: 14 }}>
                Loading products...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p style={{ color: T.textSub, padding: 14 }}>No products found</p>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.product_id}
                  onClick={() => addProduct(p)}
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
                      {p.sku} • {p.category?.category_name || "No Category"}
                    </p>
                  </div>
                  <strong style={{ color: T.green }}>
                    {money(p.selling_price)}
                  </strong>
                </button>
              ))
            )}
          </div>
        )}

        <div
          style={{
            ...card(),
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "13px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                color: T.text,
                margin: 0,
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              Sale Items
            </h3>
            <Badge color="green" small>
              {selectedItems.length} products • {totalQty} qty
            </Badge>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {selectedItems.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 52 }}>🛒</div>
                  <p style={{ color: T.textSub, fontSize: 13 }}>
                    No items added yet. Search product above.
                  </p>
                </div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: T.bg2 }}>
                  <tr>
                    <th style={th()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.size === selectedItems.length}
                        onChange={toggleAll}
                      />
                    </th>
                    <th style={th()}>Product</th>
                    <th style={th()}>SKU</th>
                    <th style={th()}>Price</th>
                    <th style={th()}>Qty</th>
                    <th style={th()}>Total</th>
                    <th style={th()}></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr
                      key={item.product_id}
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <td style={td()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(item.product_id)}
                          onChange={() => toggleRow(item.product_id)}
                        />
                      </td>
                      <td style={td()}>
                        <p
                          style={{
                            color: T.text,
                            margin: 0,
                            fontWeight: 800,
                            fontSize: 12.5,
                          }}
                        >
                          {item.product_name}
                        </p>
                        <p
                          style={{
                            color: T.textMut,
                            margin: "3px 0 0",
                            fontSize: 10,
                          }}
                        >
                          {item.category_name}
                        </p>
                      </td>
                      <td style={td()}>
                        <span
                          style={{
                            color: T.accent,
                            fontFamily: "monospace",
                            fontWeight: 800,
                          }}
                        >
                          {item.sku}
                        </span>
                      </td>
                      <td style={td()}>
                        <strong style={{ color: T.green }}>
                          {money(item.unit_price)}
                        </strong>
                      </td>
                      <td style={td()}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <button
                            style={qtyBtn()}
                            onClick={() =>
                              updateQty(item.product_id, item.qty - 1)
                            }
                          >
                            -
                          </button>
                          <input
                            value={item.qty}
                            type="number"
                            min="1"
                            onChange={(e) =>
                              updateQty(item.product_id, e.target.value)
                            }
                            style={{
                              width: 42,
                              textAlign: "center",
                              background: T.bg3,
                              border: `1px solid ${T.border}`,
                              borderRadius: 8,
                              color: T.text,
                              padding: "5px 4px",
                            }}
                          />
                          <button
                            style={qtyBtn()}
                            onClick={() =>
                              updateQty(item.product_id, item.qty + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={td()}>
                        <strong style={{ color: T.text }}>
                          {money(item.qty * item.unit_price)}
                        </strong>
                      </td>
                      <td style={td()}>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            border: "1px solid rgba(248,113,113,.25)",
                            background: "rgba(248,113,113,.08)",
                            color: T.red,
                            cursor: "pointer",
                          }}
                        >
                          <Ic.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
        }}
      >
        <div style={{ ...card(), padding: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <p style={sectionTitle()}>CUSTOMER</p>
            <button
              onClick={() => setShowCustomerCreate(true)}
              style={{
                border: `1px solid ${T.border}`,
                background: T.bg3,
                color: T.accent,
                borderRadius: 999,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              + New
            </button>
          </div>

          {customer ? (
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: "rgba(34,197,94,.08)",
                border: "1px solid rgba(34,197,94,.2)",
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <p style={{ color: T.text, margin: 0, fontWeight: 900 }}>
                  {customer.full_name}
                </p>
                <p
                  style={{ color: T.textSub, margin: "4px 0 0", fontSize: 11 }}
                >
                  {customer.phone || "No phone"}
                </p>
              </div>
              <button
                onClick={() => setCustomer(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: T.red,
                  cursor: "pointer",
                }}
              >
                <Ic.Close />
              </button>
            </div>
          ) : (
            <div ref={customerDropRef} style={{ position: "relative" }}>
              <input
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Search customer or keep walk-in..."
                style={inputStyle()}
              />

              {showCustomerDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: 45,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    ...card(),
                    maxHeight: 220,
                    overflowY: "auto",
                    padding: 6,
                  }}
                >
                  <button
                    onClick={() => {
                      setCustomer(null);
                      setCustomerSearch("");
                      setShowCustomerDropdown(false);
                    }}
                    style={dropItemStyle()}
                  >
                    🚶 Walk-in Customer
                  </button>

                  {filteredCustomers.map((c) => (
                    <button
                      key={c.customer_id}
                      onClick={() => {
                        setCustomer(c);
                        setCustomerSearch("");
                        setShowCustomerDropdown(false);
                      }}
                      style={dropItemStyle()}
                    >
                      <div>
                        <p
                          style={{ color: T.text, margin: 0, fontWeight: 800 }}
                        >
                          {c.full_name}
                        </p>
                        <p
                          style={{
                            color: T.textMut,
                            margin: "3px 0 0",
                            fontSize: 10,
                          }}
                        >
                          {c.customer_code || `ID: ${c.customer_id}`} •{" "}
                          {c.phone || "No phone"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ ...card(), padding: 14 }}>
          <p style={sectionTitle()}>PAYMENT & DISCOUNT</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field label="Discount Type">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                style={inputStyle()}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </Field>

            <Field label="Discount Value">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                style={inputStyle()}
              />
            </Field>

            <Field label="VAT / Tax (%)">
              <input
                type="number"
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                style={inputStyle()}
              />
            </Field>

            <Field label="Paid Amount">
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder={String(totalAmount)}
                style={inputStyle()}
              />
            </Field>

            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={textareaStyle()}
              />
            </Field>
          </div>
        </div>

        <div style={{ ...card(), padding: 14, background: T.bgAlt }}>
          <p style={sectionTitle()}>BILL SUMMARY</p>

          <SummaryRow label="Subtotal" value={money(subtotal)} />
          <SummaryRow
            label="Discount"
            value={`- ${money(discountAmount)}`}
            color={T.yellow}
          />
          <SummaryRow
            label={`Tax (${vat || 0}%)`}
            value={money(taxAmount)}
            color={T.blue}
          />

          <div style={{ height: 1, background: T.border, margin: "10px 0" }} />

          <SummaryRow
            label="Total"
            value={money(totalAmount)}
            strong
            color={T.green}
          />
          <SummaryRow label="Paid" value={money(paid)} color={T.green} />
          <SummaryRow
            label="Due"
            value={money(due)}
            color={due > 0 ? T.red : T.green}
          />

          {change > 0 && (
            <SummaryRow label="Change" value={money(change)} color={T.blue} />
          )}

          <button
            onClick={handleSave}
            disabled={isSubmitting || !selectedItems.length}
            style={{
              width: "100%",
              marginTop: 14,
              border: "none",
              borderRadius: 12,
              background: T.accent,
              color: "#fff",
              fontWeight: 900,
              fontSize: 13,
              padding: "13px 16px",
              cursor:
                isSubmitting || !selectedItems.length
                  ? "not-allowed"
                  : "pointer",
              opacity: isSubmitting || !selectedItems.length ? 0.65 : 1,
            }}
          >
            {isSubmitting ? "Saving Sale..." : "Generate Invoice & Save"}
          </button>
        </div>
      </div>

      {showCustomerCreate && (
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
          <div style={{ ...card(), width: "100%", maxWidth: 520, padding: 22 }}>
            <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
              Create Customer
            </h2>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <input
                placeholder="Full name *"
                value={newCustomer.full_name}
                onChange={(e) =>
                  setNewCustomer((p) => ({ ...p, full_name: e.target.value }))
                }
                style={inputStyle()}
              />
              <input
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer((p) => ({ ...p, phone: e.target.value }))
                }
                style={inputStyle()}
              />
              <input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer((p) => ({ ...p, email: e.target.value }))
                }
                style={inputStyle()}
              />
              <textarea
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer((p) => ({ ...p, address: e.target.value }))
                }
                style={textareaStyle()}
              />
              <select
                value={newCustomer.customer_type}
                onChange={(e) =>
                  setNewCustomer((p) => ({
                    ...p,
                    customer_type: e.target.value,
                  }))
                }
                style={inputStyle()}
              >
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn
                variant="ghost"
                onClick={() => setShowCustomerCreate(false)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
              </Btn>
              <Btn
                onClick={handleCreateCustomer}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Create Customer
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: T.textSub,
          fontSize: 10,
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

function SummaryRow({ label, value, strong = false, color }) {
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
          fontSize: strong ? 14 : 12,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: color || T.text,
          fontWeight: strong ? 900 : 700,
          fontSize: strong ? 18 : 12,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function th() {
  return {
    padding: "11px 10px",
    color: T.textMut,
    fontSize: 10,
    fontWeight: 900,
    textAlign: "left",
    borderBottom: `1px solid ${T.border}`,
  };
}

function td() {
  return {
    padding: "11px 10px",
    color: T.textSub,
    fontSize: 12,
  };
}

function qtyBtn() {
  return {
    width: 26,
    height: 26,
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: "rgba(172,82,8,.12)",
    color: T.accent,
    cursor: "pointer",
    fontWeight: 900,
  };
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
    fontSize: 13,
    outline: "none",
  };
}

function textareaStyle() {
  return {
    ...inputStyle(),
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  };
}

function sectionTitle() {
  return {
    color: T.textMut,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.08em",
    margin: "0 0 10px",
  };
}

function dropItemStyle() {
  return {
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "transparent",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
  };
}
