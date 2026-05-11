import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useReturnStore } from "../../store/returnStore";
import { usePurchaseStore } from "../../store/purchaseStore";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

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

const statusColor = (s) =>
  s === "completed" || s === "approved"
    ? "green"
    : s === "pending"
      ? "yellow"
      : "red";

export default function PurchaseReturn() {
  const { t } = useLanguageStore();
  const {
    purchaseReturns,
    isLoading,
    isSubmitting,
    isUpdating,
    error,
    clearError,
    fetchPurchaseReturns,
    createPurchaseReturn,
    approvePurchaseReturn,
  } = useReturnStore();

  const { purchases, fetchPurchases, fetchPurchaseById } = usePurchaseStore();

  const [showModal, setShowModal] = useState(false);
  const [viewReturn, setViewReturn] = useState(null);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");

  useEffect(() => {
    fetchPurchaseReturns();
    fetchPurchases();
    clearError?.();
  }, [fetchPurchaseReturns, fetchPurchases, clearError]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return purchaseReturns.filter((r) => {
      const match =
        String(r.return_id).includes(q) ||
        r.purchase?.po_number?.toLowerCase().includes(q) ||
        r.product?.product_name?.toLowerCase().includes(q);

      const status = statusF === "all" || r.status === statusF;

      return match && status;
    });
  }, [purchaseReturns, search, statusF]);

  const totalRefund = filtered.reduce(
    (sum, item) => sum + Number(item.refund_amount || 0),
    0,
  );

  const handleStatus = async (id, status) => {
    await approvePurchaseReturn(id, status);
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
          [t("totalReturns"), filtered.length, T.accent, "↩️"],
          [t("refundAmount"), money(totalRefund), T.red, "💸"],
          [
            t("pending"),
            filtered.filter((r) => r.status === "pending").length,
            T.yellow,
            "⏳",
          ],
          [
            t("completed"),
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
          placeholder={t("searchReturnPoProduct")}
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allStatus")}</option>
          {["pending", "approved", "rejected", "completed"].map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>

        <Btn onClick={() => setShowModal(true)}>
          <Ic.Plus /> {t("newReturn")}
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
                t("return"),
                "PO",
                t("supplier"),
                t("product"),
                t("qty"),
                t("refund"),
                t("reason"),
                t("status"),
                t("date"),
                t("action"),
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
                <td colSpan={10} style={emptyTd()}>
                  {t("loadingPurchaseReturns")}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={emptyTd()}>
                  {t("noPurchaseReturnFound")}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.return_id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td style={tdAccent()}>PRR-{r.return_id}</td>
                  <td style={td()}>{r.purchase?.po_number || r.purchase_id}</td>
                  <td style={td()}>
                    {r.purchase?.supplier?.supplier_name || "—"}
                  </td>
                  <td style={td()}>
                    {r.product?.product_name || r.product_id}
                  </td>
                  <td style={td()}>{r.quantity}</td>
                  <td style={tdStrong(T.red)}>{money(r.refund_amount)}</td>
                  <td style={td()}>{r.reason || "—"}</td>
                  <td style={td()}>
                    <Badge color={statusColor(r.status)} small>
                      {t(r.status || "pending")?.toUpperCase()}
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
                          {t("complete")}
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
        <PurchaseReturnModal
          purchases={purchases}
          fetchPurchaseById={fetchPurchaseById}
          onClose={() => setShowModal(false)}
          onSubmit={async (payload) => {
            await createPurchaseReturn(payload);
            setShowModal(false);
          }}
          loading={isSubmitting}
        />
      )}

      {viewReturn && (
        <ReturnViewModal
          title={t("purchaseReturnDetails")}
          data={viewReturn}
          onClose={() => setViewReturn(null)}
        />
      )}
    </div>
  );
}

function PurchaseReturnModal({
  purchases,
  fetchPurchaseById,
  onClose,
  onSubmit,
  loading,
}) {
  const { t } = useLanguageStore();
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    quantity: 1,
    refund_amount: "",
    reason: "",
    status: "pending",
  });

  const filteredPurchases = purchases.filter((p) => {
    const q = purchaseSearch.toLowerCase();
    return (
      p.po_number?.toLowerCase().includes(q) ||
      p.supplier?.supplier_name?.toLowerCase().includes(q)
    );
  });

  const selectPurchase = async (purchase) => {
    const full = await fetchPurchaseById(purchase.purchase_id);
    setSelectedPurchase(full);
    setSelectedItem(null);
    setPurchaseSearch(full.po_number || "");
  };

  const handleItem = (itemId) => {
    const item = selectedPurchase?.items?.find(
      (x) => String(x.purchase_item_id || x.product_id) === String(itemId),
    );
    setSelectedItem(item);
    setForm((p) => ({
      ...p,
      quantity: 1,
      refund_amount:
        item?.final_unit_cost || item?.unit_cost || item?.subtotal || "",
    }));
  };

  const submit = async () => {
    if (!selectedPurchase) return alert(t("selectPurchaseFirst"));
    if (!selectedItem) return alert(t("selectProductFirst"));
    if (Number(form.quantity) <= 0) return alert(t("quantityRequired"));

    await onSubmit({
      purchase_id: Number(selectedPurchase.purchase_id),
      product_id: Number(selectedItem.product_id),
      quantity: Number(form.quantity),
      refund_amount: Number(form.refund_amount),
      reason: form.reason || null,
      status: form.status,
    });
  };

  return (
    <ModalShell title={t("createPurchaseReturn")} onClose={onClose}>
      <Field label={t("searchPo")}>
        <input
          value={purchaseSearch}
          onChange={(e) => setPurchaseSearch(e.target.value)}
          placeholder={t("searchPoSupplierPlaceholder")}
          style={inputStyle()}
        />
      </Field>

      {purchaseSearch && !selectedPurchase && (
        <div
          style={{
            ...card(),
            maxHeight: 180,
            overflowY: "auto",
            padding: 6,
            marginTop: 8,
          }}
        >
          {filteredPurchases.map((p) => (
            <button
              key={p.purchase_id}
              onClick={() => selectPurchase(p)}
              style={listBtn()}
            >
              <strong>{p.po_number}</strong>
              <span>
                {p.supplier?.supplier_name || t("supplier")} •{" "}
                {money(p.total_amount)}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedPurchase && (
        <>
          <div
            style={{ ...card(), padding: 12, marginTop: 12, background: T.bg2 }}
          >
            <b style={{ color: T.text }}>{selectedPurchase.po_number}</b>
            <p style={{ color: T.textSub, margin: "4px 0 0" }}>
              {selectedPurchase.supplier?.supplier_name || t("supplier")}
            </p>
          </div>

          <Field label={t("product")}>
            <select
              onChange={(e) => handleItem(e.target.value)}
              style={inputStyle()}
              value={
                selectedItem?.purchase_item_id || selectedItem?.product_id || ""
              }
            >
              <option value="">{t("selectPurchasedProduct")}</option>
              {selectedPurchase.items?.map((item) => (
                <option
                  key={item.purchase_item_id || item.product_id}
                  value={item.purchase_item_id || item.product_id}
                >
                  {item.product?.product_name || t("product")} — {t("qty")}:{" "}
                  {item.quantity_received || item.quantity_ordered}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t("qty")}>
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

        <Field label={t("refundAmount")}>
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

      <Field label={t("status")}>
        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          style={inputStyle()}
        >
          <option value="pending">{t("pending")}</option>
          <option value="approved">{t("approved")}</option>
          <option value="completed">{t("completed")}</option>
        </select>
      </Field>

      <Field label={t("reason")}>
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
          {t("cancel")}
        </Btn>
        <Btn
          onClick={submit}
          disabled={loading}
          style={{ flex: 1, justifyContent: "center" }}
        >
          {loading ? t("creating") : t("createReturn")}
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
  const { t } = useLanguageStore();
  return (
    <ModalShell title={title} onClose={onClose}>
      <Info label={t("returnId")} value={`PRR-${data.return_id}`} />
      <Info
        label={t("product")}
        value={data.product?.product_name || data.product_id}
      />
      <Info label={t("qty")} value={data.quantity} />
      <Info label={t("refund")} value={money(data.refund_amount)} />
      <Info label={t("reason")} value={data.reason || "—"} />
      <Info label={t("status")} value={t(data.status || "pending")} />
      <Btn
        onClick={onClose}
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        {t("close")}
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
