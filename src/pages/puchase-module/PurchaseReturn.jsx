import { useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { Input, Select } from "../../components/Input";

/* ── Purchase Returns Data ──────────────────────────────────────── */
const PURCHASE_RETURNS = [
  {
    id: 1,
    retId: "PRR-041",
    po: "PO-1036",
    supplier: "Teak Palace Suppliers",
    product: "Teak Wood Sofa 3-Seater",
    sku: "TWS-301",
    qty: 2,
    unitCost: 18000,
    amount: 36000,
    reason: "Defective joints on frame",
    damageType: "Manufacturing Defect",
    status: "completed",
    date: "2026-04-04",
    approvedBy: "Admin",
    refundMethod: "bank_transfer",
  },
  {
    id: 2,
    retId: "PRR-040",
    po: "PO-1038",
    supplier: "Dhaka Timber Co.",
    product: "Oak Dining Table 6-Person",
    sku: "ODT-612",
    qty: 1,
    unitCost: 26000,
    amount: 26000,
    reason: "Wrong dimensions supplied",
    damageType: "Wrong Specification",
    status: "approved",
    date: "2026-04-03",
    approvedBy: "Manager",
    refundMethod: "cash",
  },
  {
    id: 3,
    retId: "PRR-039",
    po: "PO-1040",
    supplier: "Royal Wood Imports",
    product: "Walnut Double Bed Frame",
    sku: "WDB-204",
    qty: 3,
    unitCost: 22000,
    amount: 66000,
    reason: "Water damage during transit",
    damageType: "Transit Damage",
    status: "pending",
    date: "2026-04-02",
    approvedBy: null,
    refundMethod: null,
  },
  {
    id: 4,
    retId: "PRR-038",
    po: "PO-1034",
    supplier: "BambooCraft Wholesale",
    product: "Bamboo Bookshelf Large",
    sku: "BBL-104",
    qty: 5,
    unitCost: 7500,
    amount: 37500,
    reason: "Incorrect color variant sent",
    damageType: "Wrong Order",
    status: "pending",
    date: "2026-04-01",
    approvedBy: null,
    refundMethod: null,
  },
  {
    id: 5,
    retId: "PRR-037",
    po: "PO-1035",
    supplier: "Royal Wood Imports",
    product: "Rattan Armchair Premium",
    sku: "RAC-110",
    qty: 4,
    unitCost: 5500,
    amount: 22000,
    reason: "Surface scratches on all units",
    damageType: "Physical Damage",
    status: "rejected",
    date: "2026-03-31",
    approvedBy: "Admin",
    refundMethod: null,
  },
  {
    id: 6,
    retId: "PRR-036",
    po: "PO-1037",
    supplier: "EcoFurn Materials",
    product: "Mahogany Coffee Table",
    sku: "MCT-405",
    qty: 2,
    unitCost: 9200,
    amount: 18400,
    reason: "Missing hardware components",
    damageType: "Incomplete Delivery",
    status: "completed",
    date: "2026-03-30",
    approvedBy: "Manager",
    refundMethod: "bank_transfer",
  },
];

/* ── New Return Form Modal ──────────────────────────────────────── */
const NewReturnModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    po: "",
    supplier: "",
    product: "",
    sku: "",
    qty: "1",
    unitCost: "",
    reason: "",
    damageType: "Manufacturing Defect",
    refundMethod: "bank_transfer",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const amount = (parseInt(form.qty) || 0) * (parseInt(form.unitCost) || 0);
  const canSave =
    form.po &&
    form.supplier &&
    form.product &&
    form.qty &&
    form.unitCost &&
    form.reason;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
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
          padding: "24px 26px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.5)",
          animation: "slideUp .25s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "rgba(248,113,113,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.red,
                }}
              >
                <Ic.Return />
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
                  New Purchase Return
                </h3>
                <p style={{ color: T.textSub, fontSize: 11, margin: 0 }}>
                  Log a return request to supplier
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textSub,
              padding: 4,
            }}
          >
            <Ic.Close />
          </button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Input
            label="PO Number *"
            value={form.po}
            onChange={set("po")}
            placeholder="PO-XXXX"
            icon={<Ic.Receipt />}
          />
          <Input
            label="Supplier *"
            value={form.supplier}
            onChange={set("supplier")}
            placeholder="Supplier name"
            icon={<Ic.Package />}
          />
          <div style={{ gridColumn: "1/-1" }}>
            <Input
              label="Product Name *"
              value={form.product}
              onChange={set("product")}
              placeholder="Product being returned"
            />
          </div>
          <Input
            label="SKU Code"
            value={form.sku}
            onChange={set("sku")}
            placeholder="SKU-XXXX"
          />
          <Select
            label="Damage / Return Type"
            value={form.damageType}
            onChange={set("damageType")}
            options={[
              "Manufacturing Defect",
              "Transit Damage",
              "Wrong Specification",
              "Wrong Order",
              "Incomplete Delivery",
              "Physical Damage",
              "Other",
            ]}
          />
          <Input
            label="Quantity *"
            value={form.qty}
            onChange={set("qty")}
            type="number"
            placeholder="1"
          />
          <Input
            label="Unit Cost (৳) *"
            value={form.unitCost}
            onChange={set("unitCost")}
            type="number"
            placeholder="0"
          />

          {/* Amount preview */}
          <div style={{ gridColumn: "1/-1" }}>
            <div
              style={{
                padding: "12px 14px",
                background: T.bg3,
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: T.textSub, fontSize: 12 }}>
                Total Refund Amount
              </span>
              <span style={{ color: T.amber, fontWeight: 900, fontSize: 20 }}>
                ৳{amount.toLocaleString()}
              </span>
            </div>
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
              REASON FOR RETURN *
            </label>
            <textarea
              value={form.reason}
              onChange={set("reason")}
              rows={2}
              placeholder="Describe the reason for return in detail..."
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

          <Select
            label="Refund Method"
            value={form.refundMethod}
            onChange={set("refundMethod")}
            options={[
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "cash", label: "Cash Refund" },
              { value: "credit_note", label: "Credit Note" },
            ]}
          />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                padding: "9px 12px",
                background: "rgba(248,113,113,0.08)",
                borderRadius: 9,
                border: "1px solid rgba(248,113,113,0.2)",
                width: "100%",
              }}
            >
              <p
                style={{
                  color: T.textMut,
                  fontSize: 9.5,
                  margin: "0 0 3px",
                  fontWeight: 600,
                }}
              >
                STATUS
              </p>
              <p
                style={{
                  color: T.yellow,
                  fontSize: 12,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                ⏳ Pending Approval
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 9,
            marginTop: 20,
          }}
        >
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            onClick={() => {
              if (canSave) {
                onSave({
                  ...form,
                  id: Date.now(),
                  retId: `PRR-${String(Math.floor(Math.random() * 900) + 42)}`,
                  amount,
                  status: "pending",
                  date: "2026-04-04",
                  approvedBy: null,
                });
                onClose();
              }
            }}
            disabled={!canSave}
          >
            <Ic.Check /> Submit Return Request
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ── Return Detail Modal ────────────────────────────────────────── */
const ReturnDetailModal = ({ ret, onClose }) => {
  if (!ret) return null;
  const payLabel = {
    bank_transfer: "Bank Transfer",
    cash: "Cash Refund",
    credit_note: "Credit Note",
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
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
          width: 440,
          padding: "24px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
          animation: "slideUp .22s ease",
        }}
      >
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
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
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              {ret.retId}
            </div>
            <div style={{ color: T.textSub, fontSize: 11 }}>
              Purchase Return Details
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
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <StatusBadge status={ret.status} />
          <Badge color="red" small>
            {ret.damageType}
          </Badge>
          <Badge color="gold" small>
            {ret.qty} units
          </Badge>
        </div>

        <div
          style={{
            padding: "14px",
            background: T.bg3,
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>📦</span>
            <div>
              <p
                style={{
                  color: T.text,
                  fontWeight: 700,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                {ret.product}
              </p>
              <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
                <Badge color="gold" small>
                  {ret.sku}
                </Badge>
                <span style={{ color: T.textSub, fontSize: 10 }}>
                  from {ret.po}
                </span>
              </div>
            </div>
          </div>
        </div>

        {[
          ["Supplier", ret.supplier, T.text],
          ["Return Date", ret.date, T.text],
          ["Quantity Returned", `${ret.qty} units`, T.blue],
          ["Unit Cost", `৳${ret.unitCost.toLocaleString()}`, T.text],
          ["Refund Amount", `৳${ret.amount.toLocaleString()}`, T.amber],
          [
            "Refund Method",
            ret.refundMethod ? payLabel[ret.refundMethod] : "—",
            T.text,
          ],
          [
            "Approved By",
            ret.approvedBy || "Pending",
            ret.approvedBy ? T.green : T.yellow,
          ],
        ].map(([l, v, c]) => (
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
            <span style={{ color: c, fontWeight: 600, fontSize: 12 }}>{v}</span>
          </div>
        ))}

        <div
          style={{
            marginTop: 14,
            padding: "12px",
            background: "rgba(248,113,113,0.06)",
            borderRadius: 9,
            border: "1px solid rgba(248,113,113,0.18)",
          }}
        >
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 600,
              margin: "0 0 4px",
              letterSpacing: "0.07em",
            }}
          >
            RETURN REASON
          </p>
          <p
            style={{ color: T.text, fontSize: 12, margin: 0, lineHeight: 1.5 }}
          >
            {ret.reason}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {ret.status === "pending" && (
            <>
              <Btn
                variant="success"
                style={{ flex: 1, justifyContent: "center" }}
                size="sm"
              >
                <Ic.Check /> Approve
              </Btn>
              <Btn
                variant="danger"
                style={{ flex: 1, justifyContent: "center" }}
                size="sm"
              >
                <Ic.Close /> Reject
              </Btn>
            </>
          )}
          <Btn
            variant="ghost"
            style={{ flex: 1, justifyContent: "center" }}
            size="sm"
            onClick={onClose}
          >
            <Ic.Print /> Print
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   PURCHASE RETURN PAGE
════════════════════════════════════════════════════════════════ */
export default function PurchaseReturn() {
  const [allReturns, setAllReturns] = useState(PURCHASE_RETURNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailReturn, setDetailReturn] = useState(null);

  const filtered = allReturns.filter((r) => {
    const matchSearch =
      r.retId.toLowerCase().includes(search.toLowerCase()) ||
      r.po.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.damageType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((r) => r.id)),
    );
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const updateStatus = (id, status) =>
    setAllReturns((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              approvedBy: status === "approved" ? "Admin" : r.approvedBy,
            }
          : r,
      ),
    );
  const bulkApprove = () => {
    selected.forEach((id) => updateStatus(id, "approved"));
    setSelected(new Set());
  };
  const bulkReject = () => {
    selected.forEach((id) => updateStatus(id, "rejected"));
    setSelected(new Set());
  };

  const totalRefund = allReturns.reduce((a, r) => a + r.amount, 0);
  const pendingRefund = allReturns
    .filter((r) => r.status === "pending")
    .reduce((a, r) => a + r.amount, 0);
  const completedRefund = allReturns
    .filter((r) => r.status === "completed")
    .reduce((a, r) => a + r.amount, 0);
  const pendingCount = allReturns.filter((r) => r.status === "pending").length;

  const damageTypes = [...new Set(PURCHASE_RETURNS.map((r) => r.damageType))];

  const statusColorMap = {
    completed: {
      bar: T.green,
      bg: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.18)",
    },
    approved: {
      bar: T.yellow,
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.18)",
    },
    pending: {
      bar: T.red,
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.18)",
    },
    rejected: { bar: T.textMut, bg: "rgba(90,61,30,0.1)", border: T.border },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}`}</style>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 13,
        }}
      >
        {[
          {
            label: "Total Returns",
            value: allReturns.length,
            sub: "All return requests",
            color: T.amber,
            icon: <Ic.Return />,
            bold: false,
          },
          {
            label: "Total Refund Value",
            value: `৳${totalRefund.toLocaleString()}`,
            sub: "Across all returns",
            color: T.red,
            icon: <Ic.Cash />,
            bold: true,
          },
          {
            label: "Pending Approval",
            value: `${pendingCount} returns`,
            sub: `৳${pendingRefund.toLocaleString()} pending`,
            color: T.yellow,
            icon: <Ic.Alert />,
            bold: false,
          },
          {
            label: "Refund Completed",
            value: `৳${completedRefund.toLocaleString()}`,
            sub: `${allReturns.filter((r) => r.status === "completed").length} orders resolved`,
            color: T.green,
            icon: <Ic.Check />,
            bold: true,
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "15px 17px",
              cursor: "default",
              transition: "all .2s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = k.color + "45";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.transform = "none";
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                right: -15,
                bottom: -15,
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: k.color + "0a",
                border: `1px solid ${k.color}15`,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: k.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: k.color,
                  flexShrink: 0,
                }}
              >
                {k.icon}
              </div>
              <div>
                <p
                  style={{
                    color: T.textSub,
                    fontSize: 10,
                    margin: 0,
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  {k.label.toUpperCase()}
                </p>
                <p
                  style={{
                    color: k.bold ? k.color : T.text,
                    fontSize: 19,
                    fontWeight: 900,
                    margin: "3px 0 2px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {k.value}
                </p>
                <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                  {k.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status pipeline visual ── */}
      <div style={{ ...card(), padding: "14px 20px" }}>
        <p
          style={{
            color: T.textMut,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.09em",
            margin: "0 0 12px",
          }}
        >
          RETURN STATUS PIPELINE
        </p>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {[
            {
              label: "Pending",
              count: allReturns.filter((r) => r.status === "pending").length,
              color: T.red,
              icon: "⏳",
            },
            {
              label: "Approved",
              count: allReturns.filter((r) => r.status === "approved").length,
              color: T.yellow,
              icon: "✓",
            },
            {
              label: "Completed",
              count: allReturns.filter((r) => r.status === "completed").length,
              color: T.green,
              icon: "✅",
            },
            {
              label: "Rejected",
              count: allReturns.filter((r) => r.status === "rejected").length,
              color: T.textMut,
              icon: "✗",
            },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ flex: 1, position: "relative" }}>
              <div
                style={{
                  padding: "10px 14px",
                  background: s.color + "10",
                  border: `1px solid ${s.color}30`,
                  borderRadius:
                    i === 0
                      ? "9px 0 0 9px"
                      : i === arr.length - 1
                        ? "0 9px 9px 0"
                        : 0,
                  borderLeft: i > 0 ? "none" : undefined,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <p
                    style={{
                      color: s.color,
                      fontSize: 11,
                      fontWeight: 700,
                      margin: 0,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label.toUpperCase()}
                  </p>
                  <p
                    style={{
                      color: T.text,
                      fontSize: 22,
                      fontWeight: 900,
                      margin: "1px 0 0",
                      lineHeight: 1,
                    }}
                  >
                    {s.count}
                  </p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: -12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                  }}
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill={T.border}
                  >
                    <path
                      d="M9 4l8 8-8 8"
                      stroke={T.textMut}
                      strokeWidth={2}
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters + Actions ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            icon={<Ic.Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by return ID, PO, supplier, product..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "completed", label: "Completed" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            ...damageTypes.map((t) => ({ value: t, label: t })),
          ]}
        />
        <div style={{ display: "flex", gap: 7 }}>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          >
            <Ic.Close /> Clear
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Download /> Export
          </Btn>
          <Btn onClick={() => setShowNewModal(true)} size="sm">
            <Ic.Plus /> New Return
          </Btn>
        </div>
      </div>

      {/* ── Bulk bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(248,113,113,0.07)",
            borderColor: "rgba(248,113,113,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.red,
              boxShadow: `0 0 8px ${T.red}`,
            }}
          />
          <span style={{ color: T.text, fontWeight: 700, fontSize: 12.5 }}>
            {selected.size} returns selected
          </span>
          <span style={{ color: T.textSub, fontSize: 12 }}>•</span>
          <span style={{ color: T.textSub, fontSize: 12 }}>
            Total:{" "}
            <strong style={{ color: T.amber }}>
              ৳
              {filtered
                .filter((r) => selected.has(r.id))
                .reduce((a, r) => a + r.amount, 0)
                .toLocaleString()}
            </strong>
          </span>
          <div style={{ flex: 1 }} />
          <Btn variant="success" size="sm" onClick={bulkApprove}>
            <Ic.Check /> Bulk Approve
          </Btn>
          <Btn variant="danger" size="sm" onClick={bulkReject}>
            <Ic.Close /> Bulk Reject
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print Selected
          </Btn>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.textMut,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Ic.Close />
          </button>
        </div>
      )}

      {/* ── Results count ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {allReturns.length} returns
        </p>
        {pendingCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 20,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: T.red,
                display: "inline-block",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span style={{ color: T.red, fontSize: 11, fontWeight: 700 }}>
              {pendingCount} returns awaiting approval
            </span>
          </div>
        )}
      </div>

      {/* ── Return Cards (rich card layout) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Bulk checkbox header */}
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: T.bg2,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <input
            type="checkbox"
            checked={selected.size === filtered.length && filtered.length > 0}
            onChange={toggleAll}
            style={{ cursor: "pointer", accentColor: T.gold }}
          />
          <span
            style={{
              color: T.textMut,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.07em",
            }}
          >
            SELECT ALL ({filtered.length})
          </span>
          <div style={{ flex: 1 }} />
          {[
            "RETURN ID",
            "SUPPLIER",
            "PRODUCT",
            "QTY",
            "REFUND AMOUNT",
            "TYPE",
            "STATUS",
            "DATE",
            "ACTIONS",
          ].map((h) => (
            <span
              key={h}
              style={{
                color: T.textMut,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.07em",
                minWidth:
                  h === "PRODUCT"
                    ? 160
                    : h === "SUPPLIER"
                      ? 130
                      : h === "ACTIONS"
                        ? 100
                        : h === "TYPE"
                          ? 120
                          : 70,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.map((ret) => {
          const sc = statusColorMap[ret.status] || statusColorMap.pending;
          const isSel = selected.has(ret.id);
          const payLabel = {
            bank_transfer: "🏦 Bank",
            cash: "💵 Cash",
            credit_note: "📄 Credit",
          };

          return (
            <div
              key={ret.id}
              style={{
                ...card(),
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: isSel ? "rgba(248,113,113,0.05)" : sc.bg,
                borderColor: isSel ? "rgba(248,113,113,0.35)" : sc.border,
                transition: "all .15s",
                cursor: "default",
                borderLeft: `3px solid ${sc.bar}`,
              }}
              onMouseEnter={(e) => {
                if (!isSel) e.currentTarget.style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => toggle(ret.id)}
                style={{
                  cursor: "pointer",
                  accentColor: T.gold,
                  flexShrink: 0,
                }}
              />

              {/* Return ID */}
              <div style={{ minWidth: 70 }}>
                <div
                  style={{
                    color: T.red,
                    fontWeight: 800,
                    fontSize: 11.5,
                    fontFamily: "monospace",
                  }}
                >
                  {ret.retId}
                </div>
                <div style={{ color: T.textMut, fontSize: 10 }}>{ret.po}</div>
              </div>

              {/* Supplier */}
              <div
                style={{
                  minWidth: 130,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {ret.supplier[0]}
                </div>
                <span
                  style={{
                    color: T.text,
                    fontSize: 11.5,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ret.supplier}
                </span>
              </div>

              {/* Product */}
              <div style={{ flex: 1, minWidth: 160, maxWidth: 200 }}>
                <div
                  style={{
                    color: T.text,
                    fontSize: 12,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ret.product}
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                  <Badge color="gold" small>
                    {ret.sku}
                  </Badge>
                </div>
              </div>

              {/* Qty */}
              <div style={{ minWidth: 70, textAlign: "center" }}>
                <div style={{ color: T.blue, fontWeight: 800, fontSize: 15 }}>
                  {ret.qty}
                </div>
                <div style={{ color: T.textMut, fontSize: 9 }}>UNITS</div>
              </div>

              {/* Amount */}
              <div style={{ minWidth: 100 }}>
                <div style={{ color: T.amber, fontWeight: 900, fontSize: 14 }}>
                  ৳{ret.amount.toLocaleString()}
                </div>
                <div style={{ color: T.textMut, fontSize: 9.5 }}>
                  ৳{ret.unitCost.toLocaleString()} × {ret.qty}
                </div>
              </div>

              {/* Type */}
              <div style={{ minWidth: 120 }}>
                <Badge color="purple" small>
                  {ret.damageType}
                </Badge>
              </div>

              {/* Status */}
              <div style={{ minWidth: 70 }}>
                <StatusBadge status={ret.status} />
                {ret.refundMethod && (
                  <div
                    style={{ color: T.textMut, fontSize: 9.5, marginTop: 3 }}
                  >
                    {payLabel[ret.refundMethod]}
                  </div>
                )}
              </div>

              {/* Date */}
              <div style={{ minWidth: 70 }}>
                <div style={{ color: T.textSub, fontSize: 11 }}>{ret.date}</div>
                <div style={{ color: T.textMut, fontSize: 10 }}>
                  {ret.approvedBy ? `By ${ret.approvedBy}` : "Pending"}
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  minWidth: 100,
                  display: "flex",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <button
                  title="View Details"
                  onClick={() => setDetailReturn(ret)}
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
                {ret.status === "pending" && (
                  <>
                    <button
                      title="Approve"
                      onClick={() => updateStatus(ret.id, "approved")}
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
                    <button
                      title="Reject"
                      onClick={() => updateStatus(ret.id, "rejected")}
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        color: T.red,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic.Close />
                    </button>
                  </>
                )}
                {ret.status === "approved" && (
                  <button
                    title="Mark Complete"
                    onClick={() => updateStatus(ret.id, "completed")}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 7,
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.2)",
                      color: T.green,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ic.Check /> Done
                  </button>
                )}
                <button
                  title="Print"
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 7,
                    background: "rgba(192,132,252,0.08)",
                    border: "1px solid rgba(192,132,252,0.2)",
                    color: T.purple,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic.Print />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ ...card(), padding: "56px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 14 }}>↩️</div>
            <p
              style={{
                color: T.textSub,
                fontSize: 14,
                fontWeight: 600,
                margin: 0,
              }}
            >
              No purchase returns found
            </p>
            <p style={{ color: T.textMut, fontSize: 12, margin: "6px 0 18px" }}>
              Try adjusting your filters or create a new return request
            </p>
            <Btn onClick={() => setShowNewModal(true)}>
              <Ic.Plus /> Create First Return
            </Btn>
          </div>
        )}
      </div>

      {/* ── Summary footer ── */}
      {filtered.length > 0 && (
        <div
          style={{
            ...card(),
            padding: "14px 18px",
            background: T.bg2,
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: T.textMut,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.07em",
            }}
          >
            FILTERED TOTALS
          </span>
          {[
            ["Returns", filtered.length, T.text],
            ["Total Qty", filtered.reduce((a, r) => a + r.qty, 0), T.blue],
            [
              "Total Refund",
              `৳${filtered.reduce((a, r) => a + r.amount, 0).toLocaleString()}`,
              T.amber,
            ],
            [
              "Pending",
              filtered.filter((r) => r.status === "pending").length,
              T.red,
            ],
            [
              "Completed",
              filtered.filter((r) => r.status === "completed").length,
              T.green,
            ],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{ display: "flex", gap: 7, alignItems: "center" }}
            >
              <span style={{ color: T.textSub, fontSize: 11 }}>{l}:</span>
              <span style={{ color: c, fontWeight: 800, fontSize: 13 }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}

      {showNewModal && (
        <NewReturnModal
          onClose={() => setShowNewModal(false)}
          onSave={(ret) => setAllReturns((p) => [ret, ...p])}
        />
      )}
      {detailReturn && (
        <ReturnDetailModal
          ret={detailReturn}
          onClose={() => setDetailReturn(null)}
        />
      )}
    </div>
  );
}
