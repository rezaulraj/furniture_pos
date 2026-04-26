import { useEffect, useMemo, useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useInstallmentStore } from "../../store/installmentStore";
import { Input, Select } from "../../components/Input";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function InstallmentsPage() {
  const {
    installments,
    isLoading,
    isSubmitting,
    error,
    fetchInstallments,
    payInstallment,
    clearError,
  } = useInstallmentStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({
    amount_paid: "",
    payment_method: "cash",
    transaction_id: "",
    notes: "",
  });

  useEffect(() => {
    fetchInstallments();
    clearError?.();
  }, [fetchInstallments, clearError]);

  const filtered = useMemo(() => {
    return installments.filter((i) => {
      const q = search.toLowerCase();
      const matchSearch =
        i.sale?.invoice_number?.toLowerCase().includes(q) ||
        i.sale?.customer?.full_name?.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [installments, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      active: filtered.filter((i) => i.status === "active").length,
      outstanding: filtered.reduce((a, i) => a + Number(i.due_amount || 0), 0),
      overdue: filtered.filter((i) => i.status === "overdue").length,
      collected: filtered.reduce((a, i) => a + Number(i.paid_amount || 0), 0),
    };
  }, [filtered]);

  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((i) => i.installment_id)),
    );

  const handlePay = async () => {
    if (!payForm.amount_paid || Number(payForm.amount_paid) <= 0) return;

    try {
      await payInstallment(payModal.installment_id, {
        amount_paid: Number(payForm.amount_paid),
        payment_method: payForm.payment_method,
        transaction_id: payForm.transaction_id || null,
        notes: payForm.notes || null,
      });
      setPayModal(null);
      setPayForm({
        amount_paid: "",
        payment_method: "cash",
        transaction_id: "",
        notes: "",
      });
    } catch {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Active Plans", value: stats.active, color: T.blue },
          {
            label: "Total Outstanding",
            value: money(stats.outstanding),
            color: T.red,
          },
          { label: "Overdue", value: stats.overdue, color: T.yellow },
          {
            label: "Total Collected",
            value: money(stats.collected),
            color: T.green,
          },
        ].map((k, i) => (
          <div key={i} style={{ ...card(), padding: "14px 16px" }}>
            <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
              {k.label}
            </p>
            <p
              style={{
                color: k.color,
                fontSize: 20,
                fontWeight: 800,
                margin: "4px 0 0",
              }}
            >
              {k.value}
            </p>
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
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            icon={<Ic.Search />}
            placeholder="Search by invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "overdue", label: "Overdue" },
            { value: "paid", label: "Paid" },
          ]}
        />
        <Btn variant="ghost" onClick={() => fetchInstallments()}>
          <Ic.RefreshCw />
        </Btn>
      </div>

      {error && <div style={{ color: T.red, fontWeight: 700 }}>{error}</div>}

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              <th style={{ padding: "11px 14px", width: 32 }}>
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {[
                "Invoice",
                "Customer",
                "Store",
                "Total",
                "Paid",
                "Due",
                "Due Date",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 10px",
                    color: T.textMut,
                    fontSize: 9.5,
                    fontWeight: 600,
                    textAlign: "left",
                    borderBottom: `1px solid ${T.border}`,
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
                <td colSpan={10} style={{ padding: 40, textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: 40, textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((inst) => (
                <tr
                  key={inst.installment_id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                >
                  <td style={{ padding: "10px 14px" }}>
                    <input
                      type="checkbox"
                      checked={selected.has(inst.installment_id)}
                      onChange={() => toggle(inst.installment_id)}
                    />
                  </td>
                  <td style={td()}>{inst.sale?.invoice_number}</td>
                  <td style={td()}>{inst.sale?.customer?.full_name || "N/A"}</td>
                  <td style={td()}>{inst.sale?.store?.store_name || "N/A"}</td>
                  <td style={td()}>{money(inst.total_amount)}</td>
                  <td style={td()}>{money(inst.paid_amount)}</td>
                  <td style={tdStrong(T.red)}>{money(inst.due_amount)}</td>
                  <td style={td()}>
                    {inst.due_date
                      ? new Date(inst.due_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={td()}>
                    <StatusBadge status={inst.status} />
                  </td>
                  <td style={td()}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => {
                          setPayModal(inst);
                          setPayForm((p) => ({ ...p, amount_paid: inst.due_amount }));
                        }}
                        style={actionBtn(T.green)}
                      >
                        <Ic.Cash /> Pay
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {payModal && (
        <div style={modalOverlay()}>
          <div style={{ ...card(), width: 400, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Record Payment</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Amount to Pay">
                <input
                  type="number"
                  value={payForm.amount_paid}
                  onChange={(e) =>
                    setPayForm((p) => ({ ...p, amount_paid: e.target.value }))
                  }
                  style={inputStyle()}
                />
              </Field>
              <Field label="Payment Method">
                <select
                  value={payForm.payment_method}
                  onChange={(e) =>
                    setPayForm((p) => ({ ...p, payment_method: e.target.value }))
                  }
                  style={inputStyle()}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                </select>
              </Field>
              <Field label="Transaction ID">
                <input
                  value={payForm.transaction_id}
                  onChange={(e) =>
                    setPayForm((p) => ({ ...p, transaction_id: e.target.value }))
                  }
                  style={inputStyle()}
                />
              </Field>
              <Field label="Notes">
                <textarea
                  value={payForm.notes}
                  onChange={(e) =>
                    setPayForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  style={inputStyle()}
                />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Btn variant="ghost" onClick={() => setPayModal(null)}>
                Cancel
              </Btn>
              <Btn onClick={handlePay} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Payment"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function td() {
  return { padding: "10px 10px", fontSize: 12, color: T.textSub };
}
function tdStrong(color) {
  return { ...td(), color, fontWeight: 700 };
}
function actionBtn(color) {
  return {
    padding: "4px 8px",
    borderRadius: 6,
    background: `${color}15`,
    border: `1px solid ${color}30`,
    color,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 4,
  };
}
function modalOverlay() {
  return {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "grid",
    placeItems: "center",
    zIndex: 1000,
  };
}
function inputStyle() {
  return {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.bg3,
    color: T.text,
  };
}
function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: T.textMut, fontWeight: 800 }}>
        {label.toUpperCase()}
      </label>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}
