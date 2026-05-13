import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { usePurchaseStore } from "../../store/purchaseStore";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function PurchaseHistory() {
  const { t } = useLanguageStore();
  const {
    purchases,
    currentPurchase,
    pagination,
    isLoading,
    error,
    fetchPurchases,
    fetchPurchaseById,
    clearError,
  } = usePurchaseStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [viewPurchase, setViewPurchase] = useState(null);

  useEffect(() => {
    const params = { page, limit: 10, search };
    if (statusF !== "all") params.status = statusF;
    fetchPurchases(params);
    clearError?.();
  }, [page, statusF, search, fetchPurchases, clearError]);

  const filtered = purchases;

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
          <option value="pending">{t("pending")}</option>
          <option value="received">{t("received")}</option>
          <option value="cancelled">{t("cancelled")}</option>
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

        <Btn variant="ghost" onClick={() => fetchPurchases({ page, limit: 10 })}>
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

      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 14,
          }}
        >
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ ...card(), minHeight: 220, opacity: 0.6 }} />
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
              <div style={{ fontSize: 48 }}>📦</div>
              <p style={{ color: T.textSub, fontWeight: 700 }}>
                {t("noPurchaseHistoryFound")}
              </p>
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.purchase_id}
                style={{
                  ...card(),
                  padding: 18,
                  borderTop: `3px solid ${
                    p.payment_status === "paid" ? T.green : T.accent
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
                        color: T.accent,
                        fontWeight: 900,
                        fontFamily: "monospace",
                        margin: 0,
                      }}
                    >
                      {p.po_number}
                    </p>
                    <p style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: "4px 0 0" }}>
                      {p.supplier?.supplier_name || "—"}
                    </p>
                  </div>
                  <Badge
                    color={
                      p.payment_status === "paid"
                        ? "green"
                        : p.payment_status === "partial"
                          ? "yellow"
                          : "blue"
                    }
                    small
                  >
                    {t(p.payment_status || "pending")?.toUpperCase()}
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
                  <InfoLine label={t("store")} value={p.store?.store_name} />
                  <InfoLine label={t("items")} value={p.items?.length || 0} />
                  <InfoLine label={t("total")} value={money(p.total_amount)} strong />
                  <InfoLine label={t("paid")} value={money(p.paid_amount)} color={T.green} />
                  <InfoLine label={t("due")} value={money(p.due_amount)} color={T.red} />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <Btn
                    onClick={() => openView(p.purchase_id)}
                    style={{ flex: 1, height: 34, fontSize: 11 }}
                  >
                    <Ic.Eye /> {t("viewDetails")}
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === "table" && (
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
                        style={iconBtnStyle(T.blue)}
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
      )}

      <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />

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

function iconBtnStyle(color, bg = "rgba(96,165,250,.1)") {
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
