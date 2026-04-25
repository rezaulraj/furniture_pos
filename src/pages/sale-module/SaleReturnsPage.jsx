import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useReturnStore } from "../../store/returnStore";
import { useSaleStore } from "../../store/saleStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

const statusColor = (s) =>
  s === "completed" || s === "approved"
    ? "green"
    : s === "pending"
      ? "yellow"
      : "red";

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

export default function SaleReturnsPage() {
  const {
    salesReturns,
    isLoading,
    isSubmitting,
    isUpdating,
    error,
    clearError,
    fetchSalesReturns,
    createSalesReturn,
    approveSalesReturn,
  } = useReturnStore();

  const { sales, fetchSales, fetchSaleById } = useSaleStore();

  const [showModal, setShowModal] = useState(false);
  const [viewReturn, setViewReturn] = useState(null);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");

  useEffect(() => {
    fetchSalesReturns();
    fetchSales();
    clearError?.();
  }, [fetchSalesReturns, fetchSales, clearError]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return salesReturns.filter((r) => {
      const match =
        String(r.return_id).includes(q) ||
        r.sale?.invoice_number?.toLowerCase().includes(q) ||
        r.product?.product_name?.toLowerCase().includes(q);

      const status = statusF === "all" || r.status === statusF;

      return match && status;
    });
  }, [salesReturns, search, statusF]);

  const handleStatus = async (id, status) => {
    await approveSalesReturn(id, status);
  };

  const totalRefund = filtered.reduce(
    (sum, item) => sum + Number(item.refund_amount || 0),
    0,
  );

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
          ["Total Returns", filtered.length, T.accent, "↩️"],
          ["Refund Amount", money(totalRefund), T.red, "💸"],
          [
            "Pending",
            filtered.filter((r) => r.status === "pending").length,
            T.yellow,
            "⏳",
          ],
          [
            "Completed",
            filtered.filter((r) => r.status === "completed").length,
            T.green,
            "✅",
          ],
        ].map(([label, value, color, icon]) => (
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
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search return, invoice, product..."
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Status</option>
          {["pending", "approved", "rejected", "completed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Btn onClick={() => setShowModal(true)}>
          <Ic.Plus /> New Return
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[
                "Return",
                "Invoice",
                "Product",
                "Qty",
                "Refund",
                "Reason",
                "Status",
                "Date",
                "Action",
              ].map((h) => (
                <th key={h} style={th()}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={emptyTd()}>
                  Loading sales returns...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={emptyTd()}>
                  No sales return found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.return_id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td style={tdAccent()}>RET-{r.return_id}</td>
                  <td style={td()}>{r.sale?.invoice_number || r.sale_id}</td>
                  <td style={td()}>
                    {r.product?.product_name || r.product_id}
                  </td>
                  <td style={td()}>{r.quantity}</td>
                  <td style={tdStrong(T.red)}>{money(r.refund_amount)}</td>
                  <td style={td()}>{r.reason || "—"}</td>
                  <td style={td()}>
                    <Badge color={statusColor(r.status)} small>
                      {r.status?.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={td()}>
                    {r.return_date
                      ? new Date(r.return_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={td()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {r.status === "pending" && (
                        <>
                          <MiniBtn
                            color={T.green}
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatus(r.return_id, "approved")
                            }
                          >
                            <Ic.Check />
                          </MiniBtn>
                          <MiniBtn
                            color={T.red}
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatus(r.return_id, "rejected")
                            }
                          >
                            <Ic.Close />
                          </MiniBtn>
                        </>
                      )}
                      {r.status === "approved" && (
                        <MiniTextBtn
                          disabled={isUpdating}
                          onClick={() => handleStatus(r.return_id, "completed")}
                        >
                          Complete
                        </MiniTextBtn>
                      )}
                      <MiniBtn color={T.blue} onClick={() => setViewReturn(r)}>
                        <Ic.Eye />
                      </MiniBtn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SalesReturnModal
          sales={sales}
          fetchSaleById={fetchSaleById}
          onClose={() => setShowModal(false)}
          onSubmit={async (payload) => {
            await createSalesReturn(payload);
            setShowModal(false);
          }}
          loading={isSubmitting}
        />
      )}

      {viewReturn && (
        <ReturnViewModal
          title="Sales Return Details"
          data={viewReturn}
          onClose={() => setViewReturn(null)}
        />
      )}
    </div>
  );
}

function SalesReturnModal({
  sales,
  fetchSaleById,
  onClose,
  onSubmit,
  loading,
}) {
  const [saleSearch, setSaleSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    quantity: 1,
    refund_amount: "",
    reason: "",
    status: "pending",
  });

  const filteredSales = sales.filter((s) => {
    const q = saleSearch.toLowerCase();
    return (
      s.invoice_number?.toLowerCase().includes(q) ||
      s.customer?.full_name?.toLowerCase().includes(q)
    );
  });

  const selectSale = async (sale) => {
    const full = await fetchSaleById(sale.sale_id);
    setSelectedSale(full);
    setSelectedItem(null);
    setSaleSearch(full.invoice_number || "");
  };

  const handleItem = (itemId) => {
    const item = selectedSale?.items?.find(
      (x) => String(x.sale_item_id || x.product_id) === String(itemId),
    );
    setSelectedItem(item);
    setForm((p) => ({
      ...p,
      quantity: 1,
      refund_amount:
        item?.final_unit_price || item?.unit_price || item?.subtotal || "",
    }));
  };

  const submit = async () => {
    if (!selectedSale) return alert("Select sale first");
    if (!selectedItem) return alert("Select product first");
    if (Number(form.quantity) <= 0) return alert("Quantity required");
    if (Number(form.refund_amount) < 0)
      return alert("Refund cannot be negative");

    await onSubmit({
      sale_id: Number(selectedSale.sale_id),
      product_id: Number(selectedItem.product_id),
      quantity: Number(form.quantity),
      refund_amount: Number(form.refund_amount),
      reason: form.reason || null,
      status: form.status,
    });
  };

  return (
    <ModalShell title="Create Sales Return" onClose={onClose}>
      <Field label="Search Invoice">
        <input
          value={saleSearch}
          onChange={(e) => setSaleSearch(e.target.value)}
          placeholder="Search invoice/customer..."
          style={inputStyle()}
        />
      </Field>

      {saleSearch && !selectedSale && (
        <div
          style={{
            ...card(),
            maxHeight: 180,
            overflowY: "auto",
            padding: 6,
            marginTop: 8,
          }}
        >
          {filteredSales.map((s) => (
            <button
              key={s.sale_id}
              onClick={() => selectSale(s)}
              style={listBtn()}
            >
              <strong>{s.invoice_number}</strong>
              <span>
                {s.customer?.full_name || "Walk-in"} • {money(s.total_amount)}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedSale && (
        <>
          <div
            style={{ ...card(), padding: 12, marginTop: 12, background: T.bg2 }}
          >
            <b style={{ color: T.text }}>{selectedSale.invoice_number}</b>
            <p style={{ color: T.textSub, margin: "4px 0 0" }}>
              {selectedSale.customer?.full_name || "Walk-in Customer"}
            </p>
          </div>

          <Field label="Product">
            <select
              onChange={(e) => handleItem(e.target.value)}
              style={inputStyle()}
              value={
                selectedItem?.sale_item_id || selectedItem?.product_id || ""
              }
            >
              <option value="">Select sold product</option>
              {selectedSale.items?.map((item) => (
                <option
                  key={item.sale_item_id || item.product_id}
                  value={item.sale_item_id || item.product_id}
                >
                  {item.product?.product_name || "Product"} — Qty:{" "}
                  {item.quantity}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Quantity">
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) =>
              setForm((p) => ({ ...p, quantity: e.target.value }))
            }
            style={inputStyle()}
          />
        </Field>

        <Field label="Refund Amount">
          <input
            type="number"
            min="0"
            value={form.refund_amount}
            onChange={(e) =>
              setForm((p) => ({ ...p, refund_amount: e.target.value }))
            }
            style={inputStyle()}
          />
        </Field>
      </div>

      <Field label="Status">
        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          style={inputStyle()}
        >
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="completed">completed</option>
        </select>
      </Field>

      <Field label="Reason">
        <textarea
          rows={3}
          value={form.reason}
          onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
          style={{ ...inputStyle(), resize: "vertical" }}
        />
      </Field>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Btn
          variant="ghost"
          onClick={onClose}
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </Btn>
        <Btn
          onClick={submit}
          disabled={loading}
          style={{ flex: 1, justifyContent: "center" }}
        >
          {loading ? "Creating..." : "Create Return"}
        </Btn>
      </div>
    </ModalShell>
  );
}

/* shared helpers */
function ModalShell({ title, children, onClose }) {
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
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h2 style={{ color: T.text, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={closeBtn()}>
            <Ic.Close />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReturnViewModal({ title, data, onClose }) {
  return (
    <ModalShell title={title} onClose={onClose}>
      <Info label="Return ID" value={`RET-${data.return_id}`} />
      <Info
        label="Product"
        value={data.product?.product_name || data.product_id}
      />
      <Info label="Quantity" value={data.quantity} />
      <Info label="Refund" value={money(data.refund_amount)} />
      <Info label="Reason" value={data.reason || "—"} />
      <Info label="Status" value={data.status} />
      <Btn
        onClick={onClose}
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        Close
      </Btn>
    </ModalShell>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ color: T.textSub, fontSize: 11, fontWeight: 800 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div style={{ ...card(), padding: 12, marginBottom: 8 }}>
      <p style={{ color: T.textMut, margin: 0, fontSize: 10 }}>{label}</p>
      <b style={{ color: T.text }}>{value}</b>
    </div>
  );
}
function th() {
  return { padding: 12, color: T.textMut, fontSize: 10, textAlign: "left" };
}
function td() {
  return { padding: 12, color: T.textSub, fontSize: 12 };
}
function tdAccent() {
  return { ...td(), color: T.accent, fontWeight: 900 };
}
function tdStrong(color) {
  return { ...td(), color, fontWeight: 900 };
}
function emptyTd() {
  return { padding: 36, textAlign: "center", color: T.textSub };
}
function closeBtn() {
  return {
    width: 34,
    height: 34,
    borderRadius: 9,
    border: `1px solid ${T.border}`,
    background: T.bg3,
    color: T.text,
    cursor: "pointer",
  };
}
function listBtn() {
  return {
    width: "100%",
    padding: 10,
    border: "none",
    background: "transparent",
    color: T.text,
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  };
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
        cursor: "pointer",
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
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 900,
      }}
    >
      {children}
    </button>
  );
}
