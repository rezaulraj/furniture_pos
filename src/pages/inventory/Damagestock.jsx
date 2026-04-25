import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Damage Data ─────────────────────────────────────────────────── */
const DAMAGE_DATA = [
  {
    id: 1,
    dId: "DMG-041",
    product: "Teak Wood Sofa 3-Seater",
    sku: "TWS-301",
    img: "🛋️",
    store: "Main Store — Dhaka",
    qty: 1,
    lossValue: 18000,
    damageType: "Water Damage",
    description: "Upholstery damaged due to pipe leak in storage area",
    reportedBy: "Staff Ahmed",
    actionTaken: "Sent for repair",
    status: "reviewed",
    date: "2026-04-03",
  },
  {
    id: 2,
    dId: "DMG-040",
    product: "Oak Dining Table 6-Person",
    sku: "ODT-612",
    img: "🪑",
    store: "Branch — Chittagong",
    qty: 2,
    lossValue: 52000,
    damageType: "Physical Damage",
    description: "Cracked tabletop during unloading from delivery truck",
    reportedBy: "Manager Karim",
    actionTaken: null,
    status: "reported",
    date: "2026-04-03",
  },
  {
    id: 3,
    dId: "DMG-039",
    product: "Bamboo Bookshelf Large",
    sku: "BBL-104",
    img: "📚",
    store: "Main Store — Dhaka",
    qty: 3,
    lossValue: 22500,
    damageType: "Defective Product",
    description: "Missing hardware and unstable joints found on delivery",
    reportedBy: "Staff Rahim",
    actionTaken: "Return to supplier initiated",
    status: "resolved",
    date: "2026-04-02",
  },
  {
    id: 4,
    dId: "DMG-038",
    product: "Rattan Armchair Premium",
    sku: "RAC-110",
    img: "🪑",
    store: "Branch — Sylhet",
    qty: 2,
    lossValue: 11000,
    damageType: "Transit Damage",
    description: "Structural damage to frame during branch transfer",
    reportedBy: "Staff Nazia",
    actionTaken: null,
    status: "reported",
    date: "2026-04-01",
  },
  {
    id: 5,
    dId: "DMG-037",
    product: "Pine Wood Nightstand",
    sku: "PIN-801",
    img: "🌙",
    store: "Main Store — Dhaka",
    qty: 5,
    lossValue: 19000,
    damageType: "Fire/Smoke",
    description: "Minor smoke damage to finish from nearby electrical fault",
    reportedBy: "Manager Rahman",
    actionTaken: "Professional cleaning ordered",
    status: "reviewed",
    date: "2026-03-31",
  },
  {
    id: 6,
    dId: "DMG-036",
    product: "Walnut Double Bed Frame",
    sku: "WDB-204",
    img: "🛏️",
    store: "Branch — Sylhet",
    qty: 1,
    lossValue: 22000,
    damageType: "Customer Return",
    description: "Returned unit with extensive scratches and broken slats",
    reportedBy: "Staff Parvin",
    actionTaken: "Discarded — beyond repair",
    status: "discarded",
    date: "2026-03-29",
  },
  {
    id: 7,
    dId: "DMG-035",
    product: "Mahogany Coffee Table",
    sku: "MCT-405",
    img: "☕",
    store: "Branch — Chittagong",
    qty: 1,
    lossValue: 9200,
    damageType: "Theft/Missing",
    description: "Unit reported missing after store inventory count",
    reportedBy: "Manager Selim",
    actionTaken: "Police report filed",
    status: "resolved",
    date: "2026-03-28",
  },
];

const DAMAGE_TYPES = [
  "Water Damage",
  "Physical Damage",
  "Defective Product",
  "Transit Damage",
  "Fire/Smoke",
  "Customer Return",
  "Theft/Missing",
  "Pest/Infestation",
  "Other",
];

const STATUS_MAP = {
  reported: {
    color: T.red,
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.28)",
    icon: "🚨",
    label: "Reported",
  },
  reviewed: {
    color: T.yellow,
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.28)",
    icon: "🔍",
    label: "Under Review",
  },
  resolved: {
    color: T.green,
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.28)",
    icon: "✅",
    label: "Resolved",
  },
  discarded: {
    color: T.textSub,
    bg: "rgba(90,61,30,0.12)",
    border: T.border,
    icon: "🗑️",
    label: "Discarded",
  },
};

const TYPE_COLORS = {
  "Water Damage": T.blue,
  "Physical Damage": T.red,
  "Defective Product": T.yellow,
  "Transit Damage": T.purple,
  "Fire/Smoke": "#fb923c",
  "Customer Return": T.amber,
  "Theft/Missing": "#f43f5e",
  Other: T.textSub,
};

/* ── Report Damage Modal ────────────────────────────────────────── */
const ReportModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    product: "",
    sku: "",
    store: "Main Store — Dhaka",
    qty: "1",
    lossValue: "",
    damageType: "Physical Damage",
    description: "",
    reportedBy: "",
    actionTaken: "",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const canSave =
    form.product && form.qty && form.description && form.reportedBy;

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
          animation: "slideUp .25s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

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
              <h3
                style={{
                  color: T.text,
                  fontWeight: 900,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                Report Damaged Stock
              </h3>
              <p style={{ color: T.textSub, fontSize: 11, margin: 0 }}>
                Document a damage incident for inventory records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
            }}
          >
            <Ic.Close />
          </button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div style={{ gridColumn: "1/-1" }}>
            <Input
              label="Product Name *"
              value={form.product}
              onChange={set("product")}
              placeholder="Name of damaged product"
            />
          </div>
          <Input
            label="SKU Code"
            value={form.sku}
            onChange={set("sku")}
            placeholder="SKU-XXXX"
          />
          <Select
            label="Store"
            value={form.store}
            onChange={set("store")}
            options={[
              "Main Store — Dhaka",
              "Branch — Chittagong",
              "Branch — Sylhet",
            ]}
          />
          <Input
            label="Quantity Damaged *"
            value={form.qty}
            onChange={set("qty")}
            type="number"
            placeholder="1"
          />
          <Input
            label="Loss Value (৳)"
            value={form.lossValue}
            onChange={set("lossValue")}
            type="number"
            placeholder="Estimated cost loss"
          />
          <div style={{ gridColumn: "1/-1" }}>
            <Select
              label="Damage Type"
              value={form.damageType}
              onChange={set("damageType")}
              options={DAMAGE_TYPES}
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 6,
              }}
            >
              DAMAGE DESCRIPTION *
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Describe the damage in detail — how it occurred, extent of damage, etc."
              style={{
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
              }}
              onFocus={(e) => (e.target.style.borderColor = T.gold)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
          <Input
            label="Reported By *"
            value={form.reportedBy}
            onChange={set("reportedBy")}
            placeholder="Staff member name"
            icon={<Ic.User />}
          />
          <div>
            <label
              style={{
                color: T.textSub,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.07em",
                display: "block",
                marginBottom: 6,
              }}
            >
              INITIAL ACTION TAKEN
            </label>
            <textarea
              value={form.actionTaken}
              onChange={set("actionTaken")}
              rows={2}
              placeholder="Any immediate action taken (optional)..."
              style={{
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
              }}
              onFocus={(e) => (e.target.style.borderColor = T.gold)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
          {/* Loss preview */}
          {form.lossValue && (
            <div
              style={{
                gridColumn: "1/-1",
                padding: "11px 14px",
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 9,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: T.textSub, fontSize: 12 }}>
                Estimated Total Loss
              </span>
              <span style={{ color: T.red, fontWeight: 900, fontSize: 20 }}>
                ৳
                {(
                  (parseInt(form.qty) || 0) * (parseInt(form.lossValue) || 0)
                ).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>
          <Btn
            onClick={() => {
              if (canSave) {
                onSave({
                  ...form,
                  id: Date.now(),
                  dId: `DMG-${String(Math.floor(Math.random() * 900) + 42)}`,
                  status: "reported",
                  date: "2026-04-04",
                });
                onClose();
              }
            }}
            disabled={!canSave}
            variant="danger"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Alert /> Submit Damage Report
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ── Damage Detail Modal ────────────────────────────────────────── */
const DetailModal = ({ damage, onClose, onUpdateStatus }) => {
  const [action, setAction] = useState(damage.actionTaken || "");
  if (!damage) return null;
  const sc = STATUS_MAP[damage.status] || STATUS_MAP.reported;

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
      <div
        style={{
          ...card(),
          width: 460,
          padding: "22px 24px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
          animation: "slideUp .2s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                color: T.red,
                fontWeight: 900,
                fontSize: 15,
                fontFamily: "monospace",
              }}
            >
              {damage.dId}
            </div>
            <div style={{ color: T.textSub, fontSize: 11 }}>
              Damage Report Details
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
            }}
          >
            <Ic.Close />
          </button>
        </div>

        {/* Status + type badges */}
        <div
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 9px",
              borderRadius: 20,
              background: sc.bg,
              color: sc.color,
              border: `1px solid ${sc.border}`,
            }}
          >
            {sc.icon} {sc.label.toUpperCase()}
          </span>
          <Badge color="purple" small>
            {damage.damageType}
          </Badge>
          <Badge color="blue" small>
            {damage.store.split(" — ")[0]}
          </Badge>
        </div>

        {/* Product block */}
        <div
          style={{
            padding: "12px 14px",
            background: T.bg3,
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(248,113,113,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {damage.img}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: T.text,
                  fontWeight: 700,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                {damage.product}
              </p>
              <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
                <Badge color="gold" small>
                  {damage.sku}
                </Badge>
                <span style={{ color: T.red, fontSize: 11, fontWeight: 700 }}>
                  {damage.qty} unit{damage.qty > 1 ? "s" : ""} damaged
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  color: T.red,
                  fontWeight: 900,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                ৳{damage.lossValue.toLocaleString()}
              </p>
              <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                loss value
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        {[
          ["Date Reported", damage.date],
          ["Reported By", damage.reportedBy],
          ["Store", damage.store],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span style={{ color: T.textSub, fontSize: 12 }}>{l}</span>
            <span style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>
              {v}
            </span>
          </div>
        ))}

        {/* Description */}
        <div
          style={{
            marginTop: 14,
            padding: "11px 12px",
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 9,
          }}
        >
          <p
            style={{
              color: T.textMut,
              fontSize: 9.5,
              fontWeight: 600,
              margin: "0 0 5px",
              letterSpacing: "0.07em",
            }}
          >
            DAMAGE DESCRIPTION
          </p>
          <p
            style={{ color: T.text, fontSize: 12, margin: 0, lineHeight: 1.5 }}
          >
            {damage.description}
          </p>
        </div>

        {/* Action taken */}
        <div style={{ marginTop: 12 }}>
          <label
            style={{
              color: T.textSub,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.07em",
              display: "block",
              marginBottom: 6,
            }}
          >
            ACTION TAKEN / NOTES
          </label>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              background: T.bg3,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "8px 10px",
              color: T.text,
              fontSize: 12,
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>

        {/* Status update buttons */}
        <div
          style={{ display: "flex", gap: 7, marginTop: 16, flexWrap: "wrap" }}
        >
          {damage.status === "reported" && (
            <Btn
              variant="ghost"
              onClick={() => {
                onUpdateStatus(damage.id, "reviewed", action);
                onClose();
              }}
              size="sm"
              style={{ flex: 1, justifyContent: "center" }}
            >
              🔍 Mark Under Review
            </Btn>
          )}
          {(damage.status === "reported" || damage.status === "reviewed") && (
            <Btn
              variant="success"
              onClick={() => {
                onUpdateStatus(damage.id, "resolved", action);
                onClose();
              }}
              size="sm"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Ic.Check /> Mark Resolved
            </Btn>
          )}
          {damage.status !== "discarded" && (
            <Btn
              variant="danger"
              onClick={() => {
                onUpdateStatus(damage.id, "discarded", action);
                onClose();
              }}
              size="sm"
              style={{ flex: 1, justifyContent: "center" }}
            >
              🗑️ Discard Item
            </Btn>
          )}
          <Btn
            variant="ghost"
            onClick={onClose}
            size="sm"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Ic.Print /> Print Report
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   DAMAGE STOCK PAGE
════════════════════════════════════════════════════════════════ */
export default function DamageStock() {
  const [damages, setDamages] = useState(DAMAGE_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [showReportModal, setShowReportModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const filtered = damages.filter((d) => {
    const ms =
      d.dId.toLowerCase().includes(search.toLowerCase()) ||
      d.product.toLowerCase().includes(search.toLowerCase()) ||
      d.sku.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "all" || d.status === statusFilter;
    const mstr = storeFilter === "all" || d.store === storeFilter;
    const mty = typeFilter === "all" || d.damageType === typeFilter;
    return ms && mst && mstr && mty;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((d) => d.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const updateStatus = (id, status, actionTaken) =>
    setDamages((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status, actionTaken: actionTaken || d.actionTaken }
          : d,
      ),
    );
  const addDamage = (data) =>
    setDamages((prev) => [
      {
        ...data,
        qty: parseInt(data.qty),
        lossValue: parseInt(data.lossValue) || 0,
        img: "📦",
      },
      ...prev,
    ]);

  const totalLoss = damages.reduce((s, d) => s + d.lossValue, 0);
  const unresolvedLoss = damages
    .filter((d) => d.status !== "resolved" && d.status !== "discarded")
    .reduce((s, d) => s + d.lossValue, 0);
  const reportedCount = damages.filter((d) => d.status === "reported").length;

  const typeBreakdown = DAMAGE_TYPES.map((t) => ({
    type: t,
    count: damages.filter((d) => d.damageType === t).length,
    loss: damages
      .filter((d) => d.damageType === t)
      .reduce((s, d) => s + d.lossValue, 0),
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.loss - a.loss);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Urgent alert ── */}
      {reportedCount > 0 && (
        <div
          style={{
            padding: "13px 16px",
            background: "rgba(239,68,68,0.09)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>🚨</span>
          <p
            style={{
              color: T.text,
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              flex: 1,
            }}
          >
            <span style={{ color: "#ef4444", fontWeight: 900 }}>
              {reportedCount} damage report{reportedCount > 1 ? "s" : ""}
            </span>{" "}
            pending review —{" "}
            <span style={{ color: T.red }}>
              ৳
              {damages
                .filter((d) => d.status === "reported")
                .reduce((s, d) => s + d.lossValue, 0)
                .toLocaleString()}{" "}
              at risk
            </span>
          </p>
          <Btn size="sm" onClick={() => setStatusFilter("reported")}>
            Review Now
          </Btn>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Incidents",
            value: damages.length,
            sub: "All records",
            color: T.amber,
            icon: "📋",
          },
          {
            label: "Total Loss Value",
            value: `৳${(totalLoss / 1000).toFixed(0)}K`,
            sub: "At cost price",
            color: T.red,
            icon: "💸",
          },
          {
            label: "Unresolved Loss",
            value: `৳${(unresolvedLoss / 1000).toFixed(0)}K`,
            sub: `${damages.filter((d) => d.status !== "resolved" && d.status !== "discarded").length} open cases`,
            color: T.yellow,
            icon: "⚠️",
          },
          {
            label: "Resolved Cases",
            value: damages.filter(
              (d) => d.status === "resolved" || d.status === "discarded",
            ).length,
            sub: "Closed out",
            color: T.green,
            icon: "✅",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all .2s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "50";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -8,
                top: -8,
                fontSize: 64,
                opacity: 0.05,
              }}
            >
              {k.icon}
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: k.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {k.icon}
            </div>
            <div>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 9.5,
                  margin: 0,
                  letterSpacing: "0.06em",
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: T.text,
                  fontSize: 21,
                  fontWeight: 900,
                  margin: "2px 0 2px",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Analytics row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Damage type breakdown */}
        <div style={{ ...card(), padding: "14px 16px" }}>
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              margin: "0 0 12px",
            }}
          >
            DAMAGE TYPE BREAKDOWN
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {typeBreakdown.slice(0, 5).map((t) => {
              const pct = totalLoss
                ? Math.round((t.loss / totalLoss) * 100)
                : 0;
              const col = TYPE_COLORS[t.type] || T.textSub;
              return (
                <div key={t.type}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: col,
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          color: T.text,
                          fontSize: 11.5,
                          fontWeight: 500,
                        }}
                      >
                        {t.type}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Badge small color="gold">
                        {t.count}x
                      </Badge>
                      <span
                        style={{ color: T.red, fontWeight: 700, fontSize: 11 }}
                      >
                        ৳{(t.loss / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: T.bg,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: col,
                        borderRadius: 3,
                        transition: "width .6s ease",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status pipeline */}
        <div style={{ ...card(), padding: "14px 16px" }}>
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              margin: "0 0 12px",
            }}
          >
            CASE STATUS PIPELINE
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {Object.entries(STATUS_MAP).map(([key, sc]) => {
              const count = damages.filter((d) => d.status === key).length;
              const loss = damages
                .filter((d) => d.status === key)
                .reduce((s, d) => s + d.lossValue, 0);
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "10px 12px",
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    borderRadius: 9,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onClick={() =>
                    setStatusFilter(statusFilter === key ? "all" : key)
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "none")
                  }
                >
                  <span style={{ fontSize: 16 }}>{sc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        color: sc.color,
                        fontWeight: 700,
                        fontSize: 11.5,
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{ color: sc.color, fontWeight: 800, fontSize: 16 }}
                    >
                      {count}
                    </span>
                    <p style={{ color: T.textMut, fontSize: 9.5, margin: 0 }}>
                      ৳{(loss / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filters + Report button ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search damage ID, product, SKU..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "reported", label: "🚨 Reported" },
            { value: "reviewed", label: "🔍 Under Review" },
            { value: "resolved", label: "✅ Resolved" },
            { value: "discarded", label: "🗑️ Discarded" },
          ]}
        />
        <Select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          options={[
            { value: "all", label: "All Stores" },
            { value: "Main Store — Dhaka", label: "Main Store" },
            { value: "Branch — Chittagong", label: "Chittagong" },
            { value: "Branch — Sylhet", label: "Sylhet" },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            ...DAMAGE_TYPES.map((t) => ({ value: t, label: t })),
          ]}
        />
        <div style={{ display: "flex", gap: 7 }}>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setStoreFilter("all");
              setTypeFilter("all");
              setSearch("");
            }}
          >
            <Ic.Close /> Clear
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export
          </Btn>
          <Btn variant="danger" onClick={() => setShowReportModal(true)}>
            <Ic.Alert /> Report Damage
          </Btn>
        </div>
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "9px 14px",
            background: "rgba(248,113,113,0.07)",
            borderColor: "rgba(248,113,113,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Badge color="red">{selected.size} selected</Badge>
          <span style={{ color: T.textSub, fontSize: 12 }}>
            Loss:{" "}
            <strong style={{ color: T.red }}>
              ৳
              {filtered
                .filter((d) => selected.has(d.id))
                .reduce((s, d) => s + d.lossValue, 0)
                .toLocaleString()}
            </strong>
          </span>
          <div style={{ flex: 1 }} />
          <Btn
            variant="success"
            size="sm"
            onClick={() => {
              selected.forEach((id) => updateStatus(id, "resolved", ""));
              setSelected(new Set());
            }}
          >
            <Ic.Check /> Bulk Resolve
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print Reports
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textMut,
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      {/* ── Damage Table ── */}
      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3
              style={{
                color: T.text,
                fontWeight: 800,
                fontSize: 13.5,
                margin: 0,
              }}
            >
              Damage Records
            </h3>
            <Badge color="red" small>
              {filtered.length} records
            </Badge>
          </div>
          <span style={{ color: T.textSub, fontSize: 12 }}>
            Total filtered loss:{" "}
            <strong style={{ color: T.red }}>
              ৳{filtered.reduce((s, d) => s + d.lossValue, 0).toLocaleString()}
            </strong>
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
          >
            <thead style={{ background: T.bg2 }}>
              <tr>
                <th style={{ padding: "11px 14px", width: 34 }}>
                  <input
                    type="checkbox"
                    checked={
                      selected.size === filtered.length && filtered.length > 0
                    }
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: T.gold }}
                  />
                </th>
                {[
                  "DMG ID",
                  "Product",
                  "Store",
                  "Type",
                  "Qty",
                  "Loss Value",
                  "Reported By",
                  "Action Taken",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 9px",
                      color: T.textMut,
                      fontSize: 9.5,
                      fontWeight: 700,
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
              {filtered.map((d) => {
                const isSel = selected.has(d.id);
                const sc = STATUS_MAP[d.status] || STATUS_MAP.reported;
                const tc = TYPE_COLORS[d.damageType] || T.textSub;
                return (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      background: isSel
                        ? "rgba(248,113,113,0.05)"
                        : "transparent",
                      transition: "background .12s",
                      borderLeft: `3px solid ${sc.color}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel)
                        e.currentTarget.style.background =
                          "rgba(139,90,43,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "11px 14px" }}>
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggle(d.id)}
                        style={{ cursor: "pointer", accentColor: T.gold }}
                      />
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span
                        style={{
                          color: T.red,
                          fontWeight: 800,
                          fontSize: 12,
                          fontFamily: "monospace",
                          cursor: "pointer",
                        }}
                        onClick={() => setDetailItem(d)}
                      >
                        {d.dId}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "rgba(139,90,43,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {d.img}
                        </div>
                        <div>
                          <div
                            style={{
                              color: T.text,
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            {d.product}
                          </div>
                          <div
                            style={{
                              color: T.gold,
                              fontSize: 10,
                              fontFamily: "monospace",
                            }}
                          >
                            {d.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span style={{ color: T.textSub, fontSize: 11.5 }}>
                        {d.store.split(" — ")[0]}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: tc + "18",
                          color: tc,
                          border: `1px solid ${tc}30`,
                        }}
                      >
                        {d.damageType}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span
                        style={{ color: T.red, fontWeight: 800, fontSize: 14 }}
                      >
                        {d.qty}
                      </span>
                      <span style={{ color: T.textMut, fontSize: 10 }}>
                        {" "}
                        units
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span
                        style={{ color: T.red, fontWeight: 800, fontSize: 13 }}
                      >
                        ৳{d.lossValue.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span style={{ color: T.textSub, fontSize: 11 }}>
                        {d.reportedBy}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      {d.actionTaken ? (
                        <span style={{ color: T.green, fontSize: 11 }}>
                          ✓ {d.actionTaken.substring(0, 25)}
                          {d.actionTaken.length > 25 ? "..." : ""}
                        </span>
                      ) : (
                        <span style={{ color: T.textMut, fontSize: 11 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <span style={{ color: T.textSub, fontSize: 11 }}>
                        {d.date}
                      </span>
                    </td>
                    <td style={{ padding: "11px 9px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => setDetailItem(d)}
                          title="View & Update"
                          style={{
                            width: 27,
                            height: 27,
                            borderRadius: 7,
                            background: "rgba(96,165,250,0.1)",
                            border: "1px solid rgba(96,165,250,0.2)",
                            color: T.blue,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ic.Eye />
                        </button>
                        {d.status === "reported" && (
                          <button
                            onClick={() =>
                              updateStatus(d.id, "reviewed", d.actionTaken)
                            }
                            title="Mark Reviewed"
                            style={{
                              width: 27,
                              height: 27,
                              borderRadius: 7,
                              background: "rgba(251,191,36,0.1)",
                              border: "1px solid rgba(251,191,36,0.2)",
                              color: T.yellow,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            🔍
                          </button>
                        )}
                        {(d.status === "reported" ||
                          d.status === "reviewed") && (
                          <button
                            onClick={() =>
                              updateStatus(d.id, "resolved", d.actionTaken)
                            }
                            title="Resolve"
                            style={{
                              width: 27,
                              height: 27,
                              borderRadius: 7,
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.2)",
                              color: T.green,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ic.Check />
                          </button>
                        )}
                        <button
                          title="Print"
                          style={{
                            width: 27,
                            height: 27,
                            borderRadius: 7,
                            background: "rgba(139,90,43,0.08)",
                            border: `1px solid ${T.border}`,
                            color: T.gold,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ic.Print />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    style={{ padding: "52px", textAlign: "center" }}
                  >
                    <div style={{ fontSize: 56, marginBottom: 12 }}>🛡️</div>
                    <p
                      style={{
                        color: T.green,
                        fontSize: 14,
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      No damage records match your filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot style={{ background: T.bg2 }}>
                <tr style={{ borderTop: `2px solid ${T.border}` }}>
                  <td colSpan={4} style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        color: T.textMut,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                      }}
                    >
                      TOTALS — {filtered.length} RECORDS
                    </span>
                  </td>
                  <td style={{ padding: "10px 9px" }}>
                    <span
                      style={{ color: T.red, fontWeight: 800, fontSize: 13 }}
                    >
                      {filtered.reduce((s, d) => s + d.qty, 0)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 9px" }}>
                    <span
                      style={{ color: T.red, fontWeight: 900, fontSize: 14 }}
                    >
                      ৳
                      {filtered
                        .reduce((s, d) => s + d.lossValue, 0)
                        .toLocaleString()}
                    </span>
                  </td>
                  <td colSpan={6} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSave={addDamage}
        />
      )}
      {detailItem && (
        <DetailModal
          damage={detailItem}
          onClose={() => setDetailItem(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}
