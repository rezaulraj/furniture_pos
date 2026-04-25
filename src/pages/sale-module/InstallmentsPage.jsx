import { useState } from "react";
import { card, T } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { INSTALLMENTS } from "../../data/sampleData";

export default function InstallmentsPage() {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === INSTALLMENTS.length
        ? new Set()
        : new Set(INSTALLMENTS.map((i) => i.id)),
    );

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
          {
            label: "Active Plans",
            value: INSTALLMENTS.filter((i) => i.status === "active").length,
            color: T.blue,
          },
          {
            label: "Total Outstanding",
            value: `৳${INSTALLMENTS.reduce((a, i) => a + i.due, 0).toLocaleString()}`,
            color: T.red,
          },
          {
            label: "Overdue",
            value: INSTALLMENTS.filter((i) => i.status === "overdue").length,
            color: T.yellow,
          },
          {
            label: "Total Collected",
            value: `৳${INSTALLMENTS.reduce((a, i) => a + i.paid, 0).toLocaleString()}`,
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

      {selected.size > 0 && (
        <div
          style={{
            ...card(),
            padding: "10px 16px",
            background: "rgba(205,133,63,0.08)",
            borderColor: "rgba(205,133,63,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Badge color="gold">{selected.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn variant="success" size="sm">
            <Ic.Cash /> Record Payment
          </Btn>
          <Btn variant="ghost" size="sm">
            <Ic.Print /> Print Statements
          </Btn>
        </div>
      )}

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{ color: T.text, fontWeight: 700, fontSize: 13, margin: 0 }}
          >
            Installment Plans
          </h3>
          <Badge color="yellow" small>
            {INSTALLMENTS.filter((i) => i.status === "overdue").length} Overdue
          </Badge>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              <th style={{ padding: "11px 14px", width: 32 }}>
                <input
                  type="checkbox"
                  checked={selected.size === INSTALLMENTS.length}
                  onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: T.gold }}
                />
              </th>
              {[
                "Invoice",
                "Customer",
                "Total",
                "Paid",
                "Due",
                "Plans",
                "Next Due",
                "Next Amt",
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
                    letterSpacing: "0.07em",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INSTALLMENTS.map((inst) => (
              <tr
                key={inst.id}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: selected.has(inst.id)
                    ? "rgba(205,133,63,0.06)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(inst.id))
                    e.currentTarget.style.background = "rgba(139,90,43,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(inst.id))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "10px 14px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(inst.id)}
                    onChange={() => toggle(inst.id)}
                    style={{ cursor: "pointer", accentColor: T.gold }}
                  />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: T.gold,
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {inst.inv}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.text, fontSize: 12 }}>
                    {inst.customer}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: T.text, fontWeight: 700, fontSize: 12 }}
                  >
                    ৳{inst.total.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: T.green, fontWeight: 600, fontSize: 12 }}
                  >
                    ৳{inst.paid.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: T.red, fontWeight: 700, fontSize: 12 }}>
                    ৳{inst.due.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge color="blue" small>
                    {inst.installments} plans
                  </Badge>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: inst.status === "overdue" ? T.red : T.text,
                      fontSize: 11,
                      fontWeight: inst.status === "overdue" ? 700 : 400,
                    }}
                  >
                    {inst.next_due}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: T.amber, fontWeight: 700, fontSize: 12 }}
                  >
                    ৳{inst.next_amount.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <StatusBadge status={inst.status} />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      title="Collect Payment"
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
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
                      <Ic.Cash /> Pay
                    </button>
                    <button
                      title="View"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
