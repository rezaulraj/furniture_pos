import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Input, Select } from "../../components/Input";
import { Ic } from "../../components/Icons";
import { useSaleStore } from "../../store/saleStore";
import { useLanguageStore } from "../../store/languageStore";
import SaleInvoicePDF from "../../components/SaleInvoicePDF";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function SaleHistoryPage() {
  const { t } = useLanguageStore();
  const {
    sales,
    currentSale,
    isLoading,
    error,
    fetchSales,
    fetchSaleById,
    clearError,
  } = useSaleStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [viewSale, setViewSale] = useState(null);
  const [pdfSale, setPdfSale] = useState(null);

  useEffect(() => {
    fetchSales();
    clearError?.();
  }, [fetchSales, clearError]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const q = search.toLowerCase();

      const matchSearch =
        s.invoice_number?.toLowerCase().includes(q) ||
        s.customer?.full_name?.toLowerCase().includes(q) ||
        s.store?.store_name?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || s.payment_status === statusFilter;

      const saleDate = s.sale_date ? new Date(s.sale_date) : null;

      const matchFrom =
        !dateFrom || (saleDate && saleDate >= new Date(dateFrom));

      const matchTo =
        !dateTo ||
        (saleDate &&
          saleDate <= new Date(new Date(dateTo).setHours(23, 59, 59, 999)));

      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [sales, search, statusFilter, dateFrom, dateTo]);

  const totalSales = filtered.reduce(
    (a, s) => a + Number(s.total_amount || 0),
    0,
  );
  const totalPaid = filtered.reduce(
    (a, s) => a + Number(s.paid_amount || 0),
    0,
  );
  const totalDue = filtered.reduce((a, s) => a + Number(s.due_amount || 0), 0);

  const selectedSales = filtered.filter((s) => selected.has(s.sale_id));
  const totalSelected = selectedSales.reduce(
    (acc, s) => acc + Number(s.total_amount || 0),
    0,
  );

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((s) => s.sale_id)),
    );

  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const handleView = async (saleId) => {
    try {
      const sale = await fetchSaleById(saleId);
      setViewSale(sale);
    } catch {}
  };

  const handlePrintPdf = async (saleId) => {
    try {
      const sale = await fetchSaleById(saleId);
      setPdfSale(sale);
    } catch {}
  };

  if (pdfSale) {
    return <SaleInvoicePDF sale={pdfSale} onNewSale={() => setPdfSale(null)} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: t("totalSales"),
            value: money(totalSales),
            color: T.green,
            icon: "📈",
          },
          {
            label: t("totalPaid"),
            value: money(totalPaid),
            color: T.blue,
            icon: "✅",
          },
          {
            label: t("totalDue"),
            value: money(totalDue),
            color: T.red,
            icon: "⚠️",
          },
          {
            label: t("invoices"),
            value: `${filtered.length}`,
            color: T.accent,
            icon: "🧾",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              ...card(),
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderLeft: `4px solid ${k.color}`,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${k.color}18`,
                border: `1px solid ${k.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>

            <div>
              <p
                style={{
                  color: T.textMut,
                  fontSize: 10,
                  margin: 0,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: k.color,
                  fontSize: 20,
                  fontWeight: 900,
                  margin: "2px 0 0",
                }}
              >
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: "12px 16px",
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchInvoiceCustomerStore")}
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: t("allStatus") },
            { value: "paid", label: t("paid") },
            { value: "partial", label: t("partial") },
            { value: "pending", label: t("pending") },
            { value: "failed", label: t("failed") },
            { value: "refunded", label: t("refunded") },
            { value: "cancelled", label: t("cancelled") },
          ]}
        />

        <Input
          label={t("from")}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          type="date"
        />

        <Input
          label={t("to")}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          type="date"
        />

        <Btn variant="ghost" size="sm" onClick={() => fetchSales()}>
          <Ic.RefreshCw /> {t("refresh")}
        </Btn>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(172,82,8,0.06)",
            borderColor: "rgba(172,82,8,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Badge color="accent">{selected.size} {t("selected")}</Badge>
          <span style={{ color: T.textSub, fontSize: 12 }}>
            {t("total")}:{" "}
            <strong style={{ color: T.green }}>{money(totalSelected)}</strong>
          </span>
          <div style={{ flex: 1 }} />
          <Btn variant="ghost" size="sm">
            <Ic.Download /> {t("exportCsv")}
          </Btn>
        </div>
      )}

      <div style={{ ...card(), overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1050,
            }}
          >
            <thead style={{ background: T.bg2 }}>
              <tr>
                <th style={{ padding: "11px 14px", width: 32 }}>
                  <input
                    type="checkbox"
                    checked={
                      selected.size === filtered.length && filtered.length > 0
                    }
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: T.accent }}
                  />
                </th>

                {[
                  t("invoiceNo"),
                  t("customer"),
                  t("items"),
                  t("totalAmount"),
                  t("paid"),
                  t("due"),
                  t("status"),
                  t("seller"),
                  t("store"),
                  t("date"),
                  t("actions"),
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 10px",
                      color: T.textMut,
                      fontSize: 9.5,
                      fontWeight: 800,
                      textAlign: "left",
                      letterSpacing: "0.07em",
                      borderBottom: `1px solid ${T.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: 34,
                      color: T.textSub,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {t("loadingSales")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: 44,
                      textAlign: "center",
                      color: T.textSub,
                    }}
                  >
                    <div style={{ fontSize: 46 }}>🧾</div>
                    {t("noSaleHistoryFound")}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.sale_id}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      background: selected.has(s.sale_id)
                        ? "rgba(172,82,8,0.06)"
                        : "transparent",
                    }}
                  >
                    <td style={{ padding: "10px 14px" }}>
                      <input
                        type="checkbox"
                        checked={selected.has(s.sale_id)}
                        onChange={() => toggle(s.sale_id)}
                        style={{
                          cursor: "pointer",
                          accentColor: T.accent,
                        }}
                      />
                    </td>

                    <td style={td()}>
                      <span
                        style={{
                          color: T.accent,
                          fontWeight: 800,
                          fontSize: 12,
                          fontFamily: "monospace",
                        }}
                      >
                        {s.invoice_number}
                      </span>
                    </td>

                    <td style={td()}>
                      <span style={{ color: T.text, fontSize: 12 }}>
                        {s.customer?.full_name || t("walkInCustomer")}
                      </span>
                    </td>

                    <td style={td()}>
                      <Badge color="accent" small>
                        {s.items?.length || 0} {t("items")}
                      </Badge>
                    </td>

                    <td style={tdStrong(T.text)}>{money(s.total_amount)}</td>

                    <td style={tdStrong(T.green)}>{money(s.paid_amount)}</td>

                    <td
                      style={tdStrong(
                        Number(s.due_amount) > 0 ? T.red : T.textMut,
                      )}
                    >
                      {money(s.due_amount)}
                    </td>

                    <td style={td()}>
                      <StatusBadge status={s.payment_status} />
                    </td>

                    <td style={td()}>{s.user?.full_name || "—"}</td>

                    <td style={td()}>{s.store?.store_name || "—"}</td>

                    <td style={td()}>
                      {s.sale_date
                        ? new Date(s.sale_date).toLocaleDateString()
                        : "—"}
                    </td>

                    <td style={td()}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          title={t("view")}
                          onClick={() => handleView(s.sale_id)}
                          style={iconBtn(T.blue, "rgba(96,165,250,0.1)")}
                        >
                          <Ic.Eye />
                        </button>

                        <button
                          title={t("print")}
                          onClick={() => handlePrintPdf(s.sale_id)}
                          style={iconBtn(T.accent, "rgba(172,82,8,0.1)")}
                        >
                          <Ic.Print />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewSale && (
        <SaleViewModal
          sale={viewSale}
          onClose={() => setViewSale(null)}
          onPdf={() => {
            setPdfSale(viewSale);
            setViewSale(null);
          }}
        />
      )}
    </div>
  );
}

function SaleViewModal({ sale, onClose, onPdf }) {
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
              {sale.invoice_number}
            </h2>
            <p style={{ color: T.textSub, margin: "5px 0 0", fontSize: 12 }}>
              {sale.customer?.full_name || t("walkInCustomer")} •{" "}
              {sale.store?.store_name || t("store")}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: "1px solid rgba(248,113,113,.25)",
              background: "rgba(248,113,113,.08)",
              color: T.red,
              cursor: "pointer",
            }}
          >
            <Ic.Close />
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          <Info
            label={t("total")}
            value={money(sale.total_amount)}
            color={T.green}
          />
          <Info label={t("paid")} value={money(sale.paid_amount)} color={T.blue} />
          <Info label={t("due")} value={money(sale.due_amount)} color={T.red} />
          <Info label={t("status")} value={sale.payment_status} color={T.accent} />
        </div>

        <div style={{ ...card(), marginTop: 16, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 10,
              padding: "12px 14px",
              background: T.bg2,
              color: T.textMut,
              fontSize: 10,
              fontWeight: 900,
            }}
          >
            <div>{t("product").toUpperCase()}</div>
            <div>{t("price").toUpperCase()}</div>
            <div>{t("qty").toUpperCase()}</div>
            <div>{t("total").toUpperCase()}</div>
          </div>

          {sale.items?.map((item) => (
            <div
              key={item.sale_item_id || item.product_id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 10,
                padding: "12px 14px",
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
                {money(item.unit_price)}
              </div>
              <div style={{ color: T.text }}>{item.quantity}</div>
              <div style={{ color: T.text, fontWeight: 800 }}>
                {money(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {t("close")}
          </Btn>
          <Btn onClick={onPdf} style={{ flex: 1, justifyContent: "center" }}>
            <Ic.Print /> {t("showPdf")}
          </Btn>
        </div>
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

function td() {
  return {
    padding: "10px 10px",
    color: T.textSub,
    fontSize: 11.5,
    whiteSpace: "nowrap",
  };
}

function tdStrong(color) {
  return {
    ...td(),
    color,
    fontWeight: 800,
  };
}

function iconBtn(color, bg) {
  return {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: bg,
    border: `1px solid ${T.border}`,
    color,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  };
}
