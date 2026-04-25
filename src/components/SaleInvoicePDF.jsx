import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#f7faf9",
    color: "#040d1c",
  },
  header: {
    backgroundColor: "#040d1c",
    color: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 4,
  },
  accent: {
    color: "#ac5208",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe7df",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 8,
    color: "#5a8a72",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 11,
    fontWeight: 700,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#040d1c",
    color: "#ffffff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #e5eee9",
  },
  c1: { width: "38%" },
  c2: { width: "18%" },
  c3: { width: "14%", textAlign: "right" },
  c4: { width: "12%", textAlign: "right" },
  c5: { width: "18%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalBig: {
    fontSize: 16,
    fontWeight: 900,
    color: "#16a34a",
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    color: "#5a8a72",
    fontSize: 9,
  },
});

const money = (v) => `BDT ${Number(v || 0).toLocaleString()}`;

export function SaleInvoiceDocument({ sale }) {
  const items = sale?.items || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Furniture Shop Invoice</Text>
          <Text>Invoice: {sale?.invoice_number || "N/A"}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>
              {sale?.customer?.full_name || "Walk-in Customer"}
            </Text>
            <Text>{sale?.customer?.phone || ""}</Text>
          </View>

          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.label}>Store</Text>
            <Text style={styles.value}>
              {sale?.store?.store_name || "Current Store"}
            </Text>
            <Text>{sale?.store?.address || ""}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.tableHeader}>
            <Text style={styles.c1}>Product</Text>
            <Text style={styles.c2}>SKU</Text>
            <Text style={styles.c3}>Price</Text>
            <Text style={styles.c4}>Qty</Text>
            <Text style={styles.c5}>Total</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.c1}>
                {item.product?.product_name || item.product_name || "Product"}
              </Text>
              <Text style={styles.c2}>
                {item.product?.sku || item.sku || "-"}
              </Text>
              <Text style={styles.c3}>{money(item.unit_price)}</Text>
              <Text style={styles.c4}>{item.quantity}</Text>
              <Text style={styles.c5}>{money(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { marginLeft: "auto", width: 240 }]}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{money(sale?.subtotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Discount</Text>
            <Text>- {money(sale?.discount_amount)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Tax</Text>
            <Text>{money(sale?.tax_amount)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Paid</Text>
            <Text>{money(sale?.paid_amount)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Due</Text>
            <Text>{money(sale?.due_amount)}</Text>
          </View>

          <View
            style={{
              borderTop: "1px solid #dbe7df",
              marginTop: 6,
              paddingTop: 8,
            }}
          >
            <View style={styles.totalRow}>
              <Text>Total</Text>
              <Text style={styles.totalBig}>{money(sale?.total_amount)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for shopping with us. Powered by Furniture Shop POS.
        </Text>
      </Page>
    </Document>
  );
}

export default function SaleInvoicePDF({ sale, onNewSale }) {
  return (
    <div
      style={{
        minHeight: 520,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 24px 70px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ fontSize: 58, marginBottom: 12 }}>✅</div>

        <h2
          style={{
            color: "var(--text-primary)",
            margin: 0,
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          Sale Completed
        </h2>

        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          Invoice:{" "}
          <strong style={{ color: "var(--accent)" }}>
            {sale?.invoice_number}
          </strong>
        </p>

        <div
          style={{
            margin: "18px 0",
            padding: 16,
            borderRadius: 14,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>Total</p>
          <h1 style={{ margin: "6px 0 0", color: "var(--green)" }}>
            ৳{Number(sale?.total_amount || 0).toLocaleString()}
          </h1>
        </div>

        <PDFDownloadLink
          document={<SaleInvoiceDocument sale={sale} />}
          fileName={`${sale?.invoice_number || "invoice"}.pdf`}
          style={{
            display: "block",
            width: "100%",
            padding: "13px 16px",
            borderRadius: 12,
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 900,
            textDecoration: "none",
            marginBottom: 10,
          }}
        >
          {({ loading }) =>
            loading ? "Preparing PDF..." : "Download Invoice PDF"
          }
        </PDFDownloadLink>

        <button
          onClick={onNewSale}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-primary)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Create New Sale
        </button>
      </div>
    </div>
  );
}
