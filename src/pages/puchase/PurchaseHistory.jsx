import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { usePurchaseStore } from "../../store/purchaseStore";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function PurchaseHistory() {
  const { t } = useLanguageStore();
  const {
    purchases,
    currentPurchase,
    isLoading,
    error,
    fetchPurchases,
    fetchPurchaseById,
    clearError,
  } = usePurchaseStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [viewPurchase, setViewPurchase] = useState(null);

  useEffect(() => {
    fetchPurchases();
    clearError?.();
  }, [fetchPurchases, clearError]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return purchases.filter((p) => {
      const matches =
        p.po_number?.toLowerCase().includes(q) ||
        p.supplier?.supplier_name?.toLowerCase().includes(q) ||
        p.store?.store_name?.toLowerCase().includes(q);

      const status = statusF === "all" || p.payment_status === statusF;

      return matches && status;
    });
  }, [purchases, search, statusF]);

  const total = filtered.reduce((s, p) => s + Number(p.total_amount || 0), 0);
  const paid = filtered.reduce((s, p) => s + Number(p.paid_amount || 0), 0);
  const due = filtered.reduce((s, p) => s + Number(p.due_amount || 0), 0);

  const openView = async (id) => {
    const purchase = await fetchPurchaseById(id);
    setViewPurchase(purchase);
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
          [t("totalPurchase"), money(total), T.accent, "📦"],
          [t("paid"), money(paid), T.green, "✅"],
          [t("due"), money(due), T.red, "⚠️"],
          [t("records"), filtered.length, T.blue, "🧾"],
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
              {String(label).toUpperCase()}
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
          placeholder={t("searchPoSupplierStore")}
          style={{ ...inputStyle(), flex: 1, minWidth: 240 }}
        />

        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allStatus")}</option>
          {[
            "pending",
            "partial",
            "paid",
            "failed",
            "refunded",
            "cancelled",
          ].map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>

        <Btn variant="ghost" onClick={() => fetchPurchases()}>
          {t("refresh")}
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
                t("poNumber"),
                t("supplier"),
                t("store"),
                t("items"),
                t("total"),
                t("paid"),
                t("due"),
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
                <td
                  colSpan={10}
                  style={{ padding: 30, textAlign: "center", color: T.textSub }}
                >
                  {t("loadingPurchases")}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{ padding: 40, textAlign: "center", color: T.textSub }}
                >
                  {t("noPurchaseHistoryFound")}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.purchase_id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td style={tdAccent()}>{p.po_number}</td>
                  <td style={td()}>{p.supplier?.supplier_name || "—"}</td>
                  <td style={td()}>{p.store?.store_name || "—"}</td>
                  <td style={td()}>
                    <Badge color="blue" small>
                      {p.items?.length || 0} {t("items")}
                    </Badge>
                  </td>
                  <td style={tdStrong(T.text)}>{money(p.total_amount)}</td>
                  <td style={tdStrong(T.green)}>{money(p.paid_amount)}</td>
                  <td
                    style={tdStrong(
                      Number(p.due_amount) > 0 ? T.red : T.textMut,
                    )}
                  >
                    {money(p.due_amount)}
                  </td>
                  <td style={td()}>
                    <Badge
                      color={
                        p.payment_status === "paid"
                          ? "green"
                          : p.payment_status === "partial"
                            ? "yellow"
                            : p.payment_status === "pending"
                              ? "blue"
                              : "red"
                      }
                      small
                    >
                      {t(p.payment_status || "pending")?.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={td()}>
                    {p.order_date
                      ? new Date(p.order_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={td()}>
                    <button
                      onClick={() => openView(p.purchase_id)}
                      style={iconBtn(T.blue)}
                    >
                      <Ic.Eye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewPurchase && (
        <PurchaseModal
          purchase={viewPurchase}
          onClose={() => setViewPurchase(null)}
        />
      )}
    </div>
  );
}

function PurchaseModal({ purchase, onClose }) {
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
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 760,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 22,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 14 }}
        >
          <div>
            <h2 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
              {purchase.po_number}
            </h2>
            <p style={{ color: T.textSub, margin: "5px 0 0", fontSize: 12 }}>
              {purchase.supplier?.supplier_name || t("supplier")} •{" "}
              {purchase.store?.store_name || t("store")}
            </p>
          </div>

          <button
            onClick={onClose}
            style={iconBtn(T.red, "rgba(248,113,113,.1)")}
          >
            <Ic.Close />
          </button>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          <Info
            label={t("total")}
            value={money(purchase.total_amount)}
            color={T.green}
          />
          <Info
            label={t("paid")}
            value={money(purchase.paid_amount)}
            color={T.blue}
          />
          <Info label={t("due")} value={money(purchase.due_amount)} color={T.red} />
          <Info
            label={t("status")}
            value={t(purchase.payment_status || "pending")}
            color={T.accent}
          />
        </div>

        <div style={{ ...card(), marginTop: 16, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 10,
              padding: 12,
              background: T.bg2,
              fontSize: 11,
              fontWeight: 900,
              color: T.textMut,
            }}
          >
            <span>{t("product").toUpperCase()}</span>
            <span>{t("unitCost").toUpperCase()}</span>
            <span>{t("qty").toUpperCase()}</span>
            <span>{t("total").toUpperCase()}</span>
          </div>

          {purchase.items?.map((item) => (
            <div
              key={item.purchase_item_id || item.product_id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 10,
                padding: 12,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div>
                <p style={{ color: T.text, margin: 0, fontWeight: 800 }}>
                  {item.product?.product_name || t("product")}
                </p>
                <p
                  style={{ color: T.textMut, margin: "3px 0 0", fontSize: 10 }}
                >
                  {item.product?.sku || "—"}
                </p>
              </div>
              <div style={{ color: T.green, fontWeight: 800 }}>
                {money(item.unit_cost)}
              </div>
              <div style={{ color: T.text }}>{item.quantity_ordered}</div>
              <div style={{ color: T.text, fontWeight: 800 }}>
                {money(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        {purchase.notes && (
          <div style={{ ...card(), padding: 14, marginTop: 16 }}>
            <p style={{ color: T.textSub, margin: 0, fontSize: 11 }}>{t("notes").toUpperCase()}</p>
            <p style={{ color: T.text, marginBottom: 0 }}>{purchase.notes}</p>
          </div>
        )}

        <Btn
          onClick={onClose}
          style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
        >
          {t("close")}
        </Btn>
      </div>
    </div>
  );
}

function Info({ label, value, color }) {
  return (
    <div style={{ ...card(), padding: 12 }}>
      <p style={{ color: T.textMut, margin: 0, fontSize: 10, fontWeight: 800 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ color, margin: "5px 0 0", fontWeight: 900 }}>{value}</p>
    </div>
  );
}

function th() {
  return {
    padding: "12px 10px",
    textAlign: "left",
    color: T.textMut,
    fontSize: 10,
    fontWeight: 900,
    borderBottom: `1px solid ${T.border}`,
  };
}

function td() {
  return { padding: "12px 10px", color: T.textSub, fontSize: 12 };
}

function tdAccent() {
  return { ...td(), color: T.accent, fontWeight: 900, fontFamily: "monospace" };
}

function tdStrong(color) {
  return { ...td(), color, fontWeight: 900 };
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

function iconBtn(color, bg = "rgba(96,165,250,.1)") {
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
  };
}
