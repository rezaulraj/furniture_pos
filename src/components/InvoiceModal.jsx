import { card, T } from "../theme/colors";
import { Ic } from "./Icons";
export default function InvoiceModal({ sale, onClose }) {
  const {
    items,
    customer,
    total,
    vat,
    discount,
    paid,
    due,
    paymentType,
    seller,
    storeName,
    date,
  } = sale;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discAmt =
    discount.type === "percentage"
      ? subtotal * (discount.value / 100)
      : Number(discount.value || 0);
  const vatAmt = (subtotal - discAmt) * (vat / 100);
  const netTotal = subtotal - discAmt + vatAmt;
  const change = paid > netTotal ? paid - netTotal : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 400,
          borderRadius: 12,
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#2d1a08,#8b4513)",
            padding: "18px 20px",
            color: "#fff",
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
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: "0.03em",
                }}
              >
                WoodCraft
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  opacity: 0.7,
                }}
              >
                FURNITURE SOLUTIONS
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>
                SALES INVOICE
              </div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>
                #{sale.invoiceNo}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              fontSize: 10,
              opacity: 0.85,
            }}
          >
            <div>
              <span style={{ opacity: 0.7 }}>Store: </span>
              {storeName}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Date: </span>
              {date}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Customer: </span>
              {customer?.name || "Walk-in"}
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Seller: </span>
              {seller}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 18px" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #2d1a08" }}>
                {["Product", "SKU", "Price", "Qty", "Total"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "5px 4px",
                      textAlign: "left",
                      color: "#2d1a08",
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0e8d8" }}>
                  <td
                    style={{
                      padding: "6px 4px",
                      color: "#1a0d05",
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  >
                    {it.name}
                  </td>
                  <td
                    style={{
                      padding: "6px 4px",
                      color: "#8b5e3c",
                      fontSize: 10,
                    }}
                  >
                    {it.sku}
                  </td>
                  <td style={{ padding: "6px 4px", color: "#1a0d05" }}>
                    ৳{it.price.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "6px 4px",
                      color: "#1a0d05",
                      textAlign: "center",
                    }}
                  >
                    {it.qty}
                  </td>
                  <td
                    style={{
                      padding: "6px 4px",
                      color: "#2d1a08",
                      fontWeight: 700,
                    }}
                  >
                    ৳{(it.qty * it.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 14,
              borderTop: "2px solid #2d1a08",
              paddingTop: 10,
            }}
          >
            {[
              ["Subtotal", `৳${subtotal.toLocaleString()}`],
              ["Discount", `-৳${discAmt.toLocaleString()}`],
              [`VAT (${vat}%)`, `৳${vatAmt.toLocaleString()}`],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "3px 0",
                  fontSize: 11,
                }}
              >
                <span style={{ color: "#6b4a2a" }}>{l}</span>
                <span style={{ color: "#2d1a08", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0 5px",
                borderTop: "1px solid #2d1a08",
                marginTop: 5,
              }}
            >
              <span style={{ color: "#2d1a08", fontWeight: 800, fontSize: 13 }}>
                NET TOTAL
              </span>
              <span style={{ color: "#8b4513", fontWeight: 900, fontSize: 15 }}>
                ৳{netTotal.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 0",
                fontSize: 11,
              }}
            >
              <span style={{ color: "#6b4a2a" }}>Paid ({paymentType})</span>
              <span style={{ color: "#16a34a", fontWeight: 700 }}>
                ৳{paid.toLocaleString()}
              </span>
            </div>
            {change > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 0",
                  fontSize: 11,
                }}
              >
                <span style={{ color: "#6b4a2a" }}>Change</span>
                <span style={{ color: "#2563eb", fontWeight: 700 }}>
                  ৳{change.toLocaleString()}
                </span>
              </div>
            )}
            {due > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 0",
                  fontSize: 11,
                }}
              >
                <span style={{ color: "#dc2626" }}>Due Amount</span>
                <span style={{ color: "#dc2626", fontWeight: 700 }}>
                  ৳{due.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px",
              background: "#fdf6ed",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 10,
              color: "#8b5e3c",
            }}
          >
            Thank you for choosing WoodCraft Furniture! 🛋️
            <br />
            <span style={{ fontSize: 9 }}>
              For queries: +880-1XXX-XXXXXX | woodcraft@email.com
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, padding: "0 18px 18px" }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "9px",
              background: "linear-gradient(135deg,#2d1a08,#8b4513)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Ic.Print /> Print Invoice
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px",
              background: "#f0e8d8",
              color: "#2d1a08",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
