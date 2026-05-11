import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";
import { useDamageStore } from "../../store/damageStore";
import { useProductStore } from "../../store/productStore";
import { useBranchStore } from "../../store/branchStore";
import { useLanguageStore } from "../../store/languageStore";

export default function DamageStock() {
  const { t } = useLanguageStore();

  const DAMAGE_TYPES = [
    { value: "Water Damage", label: t("waterDamage") },
    { value: "Physical Damage", label: t("physicalDamage") },
    { value: "Defective Product", label: t("defectiveProduct") },
    { value: "Transit Damage", label: t("transitDamage") },
    { value: "Fire/Smoke", label: t("fireSmoke") },
    { value: "Customer Return", label: t("customerReturn") },
    { value: "Theft/Missing", label: t("theftMissing") },
    { value: "Pest/Infestation", label: t("pestInfestation") },
    { value: "Other", label: t("other") },
  ];

  const STATUS_MAP = {
    reported: {
      color: T.red,
      bg: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.28)",
      icon: "🚨",
      label: t("reported"),
    },
    reviewed: {
      color: T.yellow,
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.28)",
      icon: "🔍",
      label: t("reviewed"),
    },
    resolved: {
      color: T.green,
      bg: "rgba(74,222,128,0.1)",
      border: "rgba(74,222,128,0.28)",
      icon: "✅",
      label: t("resolved"),
    },
    discarded: {
      color: T.textSub,
      bg: "rgba(90,61,30,0.12)",
      border: T.border,
      icon: "🗑️",
      label: t("discarded"),
    },
  };

  const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

  const { damages, isLoading, isSubmitting, error, fetchDamages, reportDamage, updateDamageStatus, clearError } = useDamageStore();
  const { products, fetchProducts } = useProductStore();
  const { branches, fetchBranches } = useBranchStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    fetchDamages();
    fetchProducts();
    fetchBranches({ is_active: true });
    return () => clearError?.();
  }, [fetchDamages, fetchProducts, fetchBranches, clearError]);

  const filtered = useMemo(() => {
    return damages.filter((d) => {
      const q = search.toLowerCase();
      const match =
        d.product?.product_name?.toLowerCase().includes(q) ||
        d.product?.sku?.toLowerCase().includes(q) ||
        String(d.damage_id).includes(q);
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return match && matchStatus;
    });
  }, [damages, search, statusFilter]);

  const handleSaveReport = async (payload) => {
    try {
      await reportDamage({
        ...payload,
        product_id: Number(payload.product_id),
        store_id: Number(payload.store_id),
        quantity: Number(payload.quantity),
        loss_amount: Number(payload.loss_amount || 0),
      });
      setShowReportModal(false);
    } catch {}
  };

  const handleUpdateStatus = async (id, status, action_taken) => {
    try {
      await updateDamageStatus(id, { status, action_taken });
      setDetailItem(null);
    } catch {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: t("totalReports"), value: damages.length, color: T.blue, icon: "📊" },
          { label: t("pendingReview"), value: damages.filter((d) => d.status === "reported").length, color: T.red, icon: "🚨" },
          { label: t("underReview"), value: damages.filter((d) => d.status === "reviewed").length, color: T.yellow, icon: "🔍" },
          { label: t("totalLoss"), value: money(damages.reduce((a, b) => a + Number(b.loss_amount || 0), 0)), color: T.red, icon: "💸" },
        ].map((k, i) => (
          <div key={i} style={{ ...card(), padding: 16, borderLeft: `4px solid ${k.color}` }}>
            <p style={{ color: T.textSub, fontSize: 10, margin: 0, fontWeight: 800 }}>{k.label.toUpperCase()}</p>
            <p style={{ color: T.text, fontSize: 20, fontWeight: 900, margin: "6px 0 0" }}>{k.icon} {k.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card(), padding: 14, display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Input icon={<Ic.Search />} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchByProductSkuId")} />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: t("allStatus") },
            { value: "reported", label: t("reported") },
            { value: "reviewed", label: t("reviewed") },
            { value: "resolved", label: t("resolved") },
            { value: "discarded", label: t("discarded") },
          ]}
        />
        <Btn onClick={() => setShowReportModal(true)} variant="danger">
          <Ic.Alert /> {t("reportDamage")}
        </Btn>
      </div>

      {error && <div style={{ color: T.red, fontWeight: 800, padding: 10 }}>{error}</div>}

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("id"), t("product"), t("store"), t("qty"), t("loss"), t("type"), t("status"), t("date"), t("action")].map((h) => (
                <th key={h} style={{ padding: 12, color: T.textMut, fontSize: 10, textAlign: "left", fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noRecordsFound")}</td></tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.damage_id} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: 12, color: T.accent, fontWeight: 800, fontSize: 12 }}>DMG-{d.damage_id}</td>
                  <td style={{ padding: 12 }}>
                    <p style={{ color: T.text, margin: 0, fontWeight: 700, fontSize: 12 }}>{d.product?.product_name}</p>
                    <small style={{ color: T.textMut }}>{d.product?.sku}</small>
                  </td>
                  <td style={{ padding: 12, color: T.textSub, fontSize: 12 }}>{d.store?.store_name}</td>
                  <td style={{ padding: 12, color: T.red, fontWeight: 700, fontSize: 12 }}>{d.quantity}</td>
                  <td style={{ padding: 12, color: T.text, fontWeight: 700, fontSize: 12 }}>{money(d.loss_amount)}</td>
                  <td style={{ padding: 12 }}><Badge color="purple" small>{t(d.damage_type?.replace(/\s+/g, "").toLowerCase() || "other")}</Badge></td>
                  <td style={{ padding: 12 }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: 12, color: T.textSub, fontSize: 11 }}>{new Date(d.reported_date).toLocaleDateString()}</td>
                  <td style={{ padding: 12 }}>
                    <button onClick={() => setDetailItem(d)} style={{ background: "transparent", border: "none", color: T.blue, cursor: "pointer" }}><Ic.Eye /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showReportModal && (
        <ReportModal
          products={products}
          branches={branches}
          loading={isSubmitting}
          onClose={() => setShowReportModal(false)}
          onSave={handleSaveReport}
          DAMAGE_TYPES={DAMAGE_TYPES}
        />
      )}

      {detailItem && (
        <DetailModal
          damage={detailItem}
          loading={isSubmitting}
          onClose={() => setDetailItem(null)}
          onUpdateStatus={handleUpdateStatus}
          STATUS_MAP={STATUS_MAP}
        />
      )}
    </div>
  );
}

/* ── Report Damage Modal ────────────────────────────────────────── */
const ReportModal = ({ onClose, onSave, loading, products, branches, DAMAGE_TYPES }) => {
  const { t } = useLanguageStore();
  const [form, setForm] = useState({
    product_id: "",
    store_id: "",
    quantity: "1",
    loss_amount: "",
    damage_type: "Physical Damage",
    description: "",
    action_taken: "",
  });

  const [productSearch, setProductSearch] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const suggestedProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.product_name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const selectProduct = (p) => {
    setForm((f) => ({ ...f, product_id: p.product_id }));
    setProductSearch(`${p.product_name} (${p.sku})`);
    setShowSuggest(false);
  };

  const canSave = form.product_id && form.store_id && form.quantity && form.description;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          ...card(),
          width: 540,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px 26px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(248,113,113,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ⚠️
            </div>
            <div>
              <h3 style={{ color: T.text, fontWeight: 900, fontSize: 16, margin: 0 }}>
                {t("reportDamagedStock")}
              </h3>
              <p style={{ color: T.textSub, fontSize: 11, margin: 0 }}>
                {t("documentDamageIncident")}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub }}>
            <Ic.Close />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ gridColumn: "1/-1", position: "relative" }}>
            <Input
              label={`${t("searchProduct")} *`}
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              placeholder={t("startTypingProductNameOrSku")}
            />
            {showSuggest && suggestedProducts.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  ...card(),
                  maxHeight: 200,
                  overflowY: "auto",
                  padding: 5,
                  marginTop: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  background: T.bg1,
                }}
              >
                {suggestedProducts.map((p) => (
                  <button
                    key={p.product_id}
                    onClick={() => selectProduct(p)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      color: T.text,
                      borderRadius: 8,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = T.bg2)}
                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                  >
                    <span>{p.product_name}</span>
                    <small style={{ color: T.textMut }}>{p.sku}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <Select
              label={`${t("store")} *`}
              value={form.store_id}
              onChange={set("store_id")}
              options={[
                { value: "", label: t("selectStore") },
                ...branches.map((b) => ({ value: b.store_id, label: b.store_name }))
              ]}
            />
          </div>

          <Input
            label={`${t("quantityDamaged")} *`}
            value={form.quantity}
            onChange={set("quantity")}
            type="number"
            placeholder="1"
          />
          <Input
            label={`${t("lossAmount")} (৳)`}
            value={form.loss_amount}
            onChange={set("loss_amount")}
            type="number"
            placeholder={t("estimatedCostLoss")}
          />

          <div style={{ gridColumn: "1/-1" }}>
            <Select
              label={t("damageType")}
              value={form.damage_type}
              onChange={set("damage_type")}
              options={DAMAGE_TYPES}
            />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ color: T.textSub, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6 }}>
              {t("damageDescription").toUpperCase()} *
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder={t("describeDamageInDetail")}
              style={textareaStyle()}
            />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ color: T.textSub, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6 }}>
              {t("initialActionTaken").toUpperCase()}
            </label>
            <textarea
              value={form.action_taken}
              onChange={set("action_taken")}
              rows={2}
              placeholder={t("anyImmediateActionTaken")}
              style={textareaStyle()}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>
            {t("cancel")}
          </Btn>
          <Btn
            onClick={() => onSave(form)}
            disabled={!canSave || loading}
            variant="danger"
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loading ? t("reporting") : t("submitDamageReport")}
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ── Damage Detail Modal ────────────────────────────────────────── */
const DetailModal = ({ damage, onClose, onUpdateStatus, loading, STATUS_MAP }) => {
  const { t } = useLanguageStore();
  const [action, setAction] = useState(damage.action_taken || "");
  const sc = STATUS_MAP[damage.status] || STATUS_MAP.reported;

  const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ ...card(), width: 460, padding: "22px 24px", boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ color: T.red, fontWeight: 900, fontSize: 15, fontFamily: "monospace" }}>
              DMG-{damage.damage_id}
            </div>
            <div style={{ color: T.textSub, fontSize: 11 }}>{t("damageReportDetails")}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub }}>
            <Ic.Close />
          </button>
        </div>

        <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            {sc.icon} {sc.label.toUpperCase()}
          </span>
          <Badge color="purple" small>{t(damage.damage_type?.replace(/\s+/g, "").toLowerCase() || "other")}</Badge>
          <Badge color="blue" small>{damage.store?.store_name}</Badge>
        </div>

        <div style={{ padding: "12px 14px", background: T.bg3, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(248,113,113,0.1)", display: "grid", placeItems: "center", fontSize: 24 }}>
              🛋️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: 0 }}>{damage.product?.product_name}</p>
              <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
                <Badge color="gold" small>{damage.product?.sku}</Badge>
                <span style={{ color: T.red, fontSize: 11, fontWeight: 700 }}>{damage.quantity} {damage.quantity > 1 ? t("units") : t("unit")}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: T.red, fontWeight: 900, fontSize: 16, margin: 0 }}>{money(damage.loss_amount)}</p>
              <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>{t("loss")}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <InfoRow label={t("dateReported")} value={new Date(damage.reported_date).toLocaleDateString()} />
          <InfoRow label={t("reportedBy")} value={damage.reporter?.full_name || t("system")} />
          <InfoRow label={t("store")} value={damage.store?.store_name} />
        </div>

        <div style={{ marginTop: 14, padding: "11px 12px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 9 }}>
          <p style={{ color: T.textMut, fontSize: 9.5, fontWeight: 800, margin: "0 0 5px" }}>{t("description").toUpperCase()}</p>
          <p style={{ color: T.text, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{damage.description}</p>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ color: T.textSub, fontSize: 10, fontWeight: 800, display: "block", marginBottom: 6 }}>{t("actionTakenNotes").toUpperCase()}</label>
          <textarea value={action} onChange={(e) => setAction(e.target.value)} rows={2} style={textareaStyle()} />
        </div>

        <div style={{ display: "flex", gap: 7, marginTop: 16, flexWrap: "wrap" }}>
          {damage.status === "reported" && (
            <Btn
              variant="ghost"
              onClick={() => onUpdateStatus(damage.damage_id, "reviewed", action)}
              size="sm"
              disabled={loading}
              style={{ flex: 1, justifyContent: "center" }}
            >
              🔍 {t("review")}
            </Btn>
          )}
          {(damage.status === "reported" || damage.status === "reviewed") && (
            <Btn
              variant="success"
              onClick={() => onUpdateStatus(damage.damage_id, "resolved", action)}
              size="sm"
              disabled={loading}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Ic.Check /> {t("resolve")}
            </Btn>
          )}
          {damage.status !== "discarded" && (
            <Btn
              variant="danger"
              onClick={() => onUpdateStatus(damage.damage_id, "discarded", action)}
              size="sm"
              disabled={loading}
              style={{ flex: 1, justifyContent: "center" }}
            >
              🗑️ {t("discard")}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>
    <span style={{ color: T.textSub, fontSize: 12 }}>{label}</span>
    <span style={{ color: T.text, fontWeight: 700, fontSize: 12 }}>{value}</span>
  </div>
);

const textareaStyle = () => ({
  width: "100%",
  background: T.bg3,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "9px 10px",
  color: T.text,
  fontSize: 12,
  outline: "none",
  resize: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  lineHeight: 1.5,
});
