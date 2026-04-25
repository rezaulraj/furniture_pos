import { useState, useEffect, useRef } from "react";
import { card } from "../../theme/colors";
import { Badge, StatusBadge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import {
  RETURNS,
  PRODUCTS,
  CUSTOMERS,
  SALE_HISTORY,
} from "../../data/sampleData";

/* ── Return Detail Popup ──────────────────────────────────────────── */
function ReturnDetailModal({ ret, onClose, onApprove, onReject }) {
  if (!ret) return null;

  const statusColor = {
    pending: {
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.3)",
      text: "#fbbf24",
    },
    approved: {
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.3)",
      text: "var(--green)",
    },
    completed: {
      bg: "rgba(96,165,250,0.1)",
      border: "rgba(96,165,250,0.3)",
      text: "#60a5fa",
    },
    rejected: {
      bg: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.3)",
      text: "#f87171",
    },
  }[ret.status] || {
    bg: "transparent",
    border: "var(--border)",
    text: "var(--text-secondary)",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(4,13,28,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(4,13,28,0.7)",
          overflow: "hidden",
          animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1) both",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ↩️
            </div>
            <div>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                Return Details
              </h3>
              <p
                style={{ color: "var(--text-muted)", fontSize: 11, margin: 0 }}
              >
                {ret.ret}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            <Ic.Close />
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                borderRadius: 30,
                background: statusColor.bg,
                border: `1px solid ${statusColor.border}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: statusColor.text,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  color: statusColor.text,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {ret.status}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["Return ID", ret.ret, "#f87171"],
              ["Invoice", ret.inv, "var(--accent)"],
              ["Customer", ret.customer, "var(--text-primary)"],
              ["Product", ret.product, "var(--text-primary)"],
              [
                "Quantity",
                `${ret.qty} unit${ret.qty > 1 ? "s" : ""}`,
                "#fbbf24",
              ],
              ["Date", ret.date, "var(--text-secondary)"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    margin: "0 0 3px",
                  }}
                >
                  {label.toUpperCase()}
                </p>
                <p
                  style={{ color, fontWeight: 700, fontSize: 12.5, margin: 0 }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Refund Amount */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              marginBottom: 14,
              background: "rgba(248,113,113,0.07)",
              border: "1px solid rgba(248,113,113,0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Refund Amount
            </span>
            <span style={{ color: "#f87171", fontWeight: 900, fontSize: 22 }}>
              ৳{ret.amount?.toLocaleString()}
            </span>
          </div>

          {/* Reason */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 16,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                margin: "0 0 4px",
              }}
            >
              REASON
            </p>
            <p
              style={{
                color: "var(--text-primary)",
                fontSize: 12.5,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {ret.reason}
            </p>
          </div>

          {/* Actions */}
          {ret.status === "pending" ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  onApprove(ret.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 9,
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "var(--green)",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(34,197,94,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(34,197,94,0.12)")
                }
              >
                <Ic.Check /> Approve
              </button>
              <button
                onClick={() => {
                  onReject(ret.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 9,
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  color: "#f87171",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(248,113,113,0.18)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
                }
              >
                <Ic.Close /> Reject
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 9,
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                transition: "all .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c96010")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── New Return Modal with Search & Auto-Fill ────────────────────── */
function NewReturnModal({ onClose, onSubmit }) {
  const [step, setStep] = useState("search"); // search | form
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("invoice"); // invoice | product | customer
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    sale_id: null,
    product_id: null,
    quantity: 1,
    refund_amount: "",
    return_date: new Date().toISOString().split("T")[0],
    reason: "",
    approved_by: 1, // Default admin
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    let results = [];

    if (searchType === "invoice") {
      results = SALE_HISTORY.filter(
        (s) =>
          s.inv.toLowerCase().includes(query) ||
          s.customer.toLowerCase().includes(query),
      ).map((s) => ({ type: "sale", data: s }));
    } else if (searchType === "product") {
      results = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query),
      ).map((p) => ({ type: "product", data: p }));
    } else if (searchType === "customer") {
      const sales = SALE_HISTORY.filter((s) =>
        s.customer.toLowerCase().includes(query),
      ).map((s) => ({ type: "sale", data: s }));
      const customers = CUSTOMERS.filter(
        (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query),
      ).map((c) => ({ type: "customer", data: c }));
      results = [...sales, ...customers];
    }

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, searchType]);

  // Auto-fill form when sale is selected
  const handleSelectSale = (sale) => {
    setSelectedSale(sale);
    // Find first product from sale (simplified - in real app, fetch sale items)
    const product =
      PRODUCTS.find((p) => sale.items?.[0]?.name === p.name) || PRODUCTS[0];
    setSelectedProduct(product);

    setFormData((prev) => ({
      ...prev,
      sale_id: sale.id,
      product_id: product.id,
      refund_amount: product.price,
      quantity: 1,
    }));
    setSearchResults([]);
    setSearchQuery("");
    setStep("form");
  };

  // Auto-fill form when product is selected directly
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      product_id: product.id,
      refund_amount: product.price,
      quantity: 1,
    }));
    setSearchResults([]);
    setSearchQuery("");
    setStep("form");
  };

  // Handle customer selection (shows their sales)
  const handleSelectCustomer = (customer) => {
    const customerSales = SALE_HISTORY.filter(
      (s) => s.customer === customer.name,
    );
    setSearchResults(customerSales.map((s) => ({ type: "sale", data: s })));
    setSearchType("invoice");
    setSearchQuery(customer.name);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_id) newErrors.product_id = "Product is required";
    if (!formData.sale_id) newErrors.sale_id = "Invoice/Sale is required";
    if (formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1";
    if (!formData.refund_amount || formData.refund_amount <= 0)
      newErrors.refund_amount = "Valid refund amount required";
    if (!formData.reason?.trim()) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 600)); // Simulate API

      const newReturn = {
        id: Date.now(),
        ret: `RET-${Date.now().toString().slice(-6)}`,
        inv: selectedSale?.inv || `INV-${Date.now().toString().slice(-4)}`,
        customer:
          selectedSale?.customer ||
          CUSTOMERS.find((c) => c.id === 1)?.name ||
          "Walk-in",
        product: selectedProduct?.name || "Unknown Product",
        qty: parseInt(formData.quantity),
        amount: parseFloat(formData.refund_amount),
        reason: formData.reason,
        status: "pending",
        date: formData.return_date,
        // Database-aligned fields
        sale_id: formData.sale_id,
        product_id: formData.product_id,
        approved_by: formData.approved_by,
        refund_amount: parseFloat(formData.refund_amount),
        return_date: new Date(formData.return_date),
      };

      onSubmit(newReturn);
      onClose();
    } catch (err) {
      console.error("Create return failed:", err);
      alert("Failed to create return. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Calculate totals
  const productPrice = selectedProduct?.price || 0;
  const calculatedTotal = productPrice * formData.quantity;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(4,13,28,0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(4,13,28,0.7)",
          overflow: "hidden",
          animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1) both",
          fontFamily: "'Open Sans', sans-serif",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-secondary)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "rgba(172,82,8,0.15)",
                border: "1px solid rgba(172,82,8,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              <Ic.Plus />
            </div>
            <div>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                Create New Return
              </h3>
              <p
                style={{ color: "var(--text-muted)", fontSize: 11, margin: 0 }}
              >
                {step === "search"
                  ? "Search invoice, product, or customer"
                  : "Review & submit return"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            <Ic.Close />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {step === "search" ? (
            <>
              {/* Search Type Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { id: "invoice", label: "🧾 Invoice" },
                  { id: "product", label: "📦 Product" },
                  { id: "customer", label: "👤 Customer" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSearchType(tab.id);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        searchType === tab.id
                          ? "var(--accent)"
                          : "var(--bg-secondary)",
                      border: `1px solid ${searchType === tab.id ? "var(--accent)" : "var(--border)"}`,
                      color:
                        searchType === tab.id
                          ? "#fff"
                          : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all .15s",
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div
                ref={searchRef}
                style={{ position: "relative", marginBottom: 16 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--bg-secondary)",
                    border: `1px solid ${searchResults.length ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 10,
                    padding: "0 14px",
                    height: 42,
                  }}
                >
                  <Ic.Search style={{ color: "var(--text-muted)" }} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === "invoice"
                        ? "Search invoice # or customer..."
                        : searchType === "product"
                          ? "Search product name or SKU..."
                          : "Search customer name or phone..."
                    }
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Ic.Close />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "0 20px 60px rgba(4,13,28,0.6)",
                      maxHeight: 280,
                      overflowY: "auto",
                      marginTop: 6,
                    }}
                  >
                    {searchResults.map((result, idx) => (
                      <div
                        key={`${result.type}-${result.data.id}-${idx}`}
                        onClick={() => {
                          if (result.type === "sale")
                            handleSelectSale(result.data);
                          else if (result.type === "product")
                            handleSelectProduct(result.data);
                          else if (result.type === "customer")
                            handleSelectCustomer(result.data);
                        }}
                        style={{
                          padding: "10px 14px",
                          cursor: "pointer",
                          borderBottom:
                            idx < searchResults.length - 1
                              ? "1px solid var(--border)"
                              : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(172,82,8,0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span style={{ fontSize: 18 }}>
                          {result.type === "sale"
                            ? "🧾"
                            : result.type === "product"
                              ? "📦"
                              : "👤"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            {result.type === "sale"
                              ? `${result.data.inv} — ${result.data.customer}`
                              : result.type === "product"
                                ? `${result.data.name} (${result.data.sku})`
                                : `${result.data.name} • ${result.data.phone}`}
                          </div>
                          <div
                            style={{ color: "var(--text-muted)", fontSize: 10 }}
                          >
                            {result.type === "sale"
                              ? `Total: ৳${result.data.total?.toLocaleString()} • ${result.data.date}`
                              : result.type === "product"
                                ? `৳${result.data.price.toLocaleString()} • Stock: ${result.data.stock}`
                                : `${result.data.type} • Credit: ৳${result.data.credit?.toLocaleString()}`}
                          </div>
                        </div>
                        <Badge
                          small
                          color={
                            result.type === "sale"
                              ? result.data.status === "paid"
                                ? "green"
                                : result.data.status === "partial"
                                  ? "yellow"
                                  : "red"
                              : result.data.stock <= 3
                                ? "red"
                                : "green"
                          }
                        >
                          {result.type === "sale"
                            ? result.data.status
                            : result.data.stock <= 3
                              ? "Low"
                              : "In Stock"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div
                style={{
                  background: "rgba(96,165,250,0.08)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 11,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>Tip:</strong> Search by invoice number (e.g.,
                  INV-2041), product SKU (e.g., TWS-301), or customer phone to
                  auto-fill return details.
                </p>
              </div>

              {/* Recent Returns Preview */}
              <div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    margin: "0 0 10px",
                  }}
                >
                  RECENT SALES
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {SALE_HISTORY.slice(0, 3).map((sale) => (
                    <div
                      key={sale.id}
                      onClick={() => handleSelectSale(sale)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "var(--accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "rgba(172,82,8,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        🧾
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: "var(--text-primary)",
                            fontWeight: 600,
                            fontSize: 12,
                            margin: 0,
                          }}
                        >
                          {sale.inv}
                        </p>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: 10,
                            margin: 0,
                          }}
                        >
                          {sale.customer}
                        </p>
                      </div>
                      <span
                        style={{
                          color: "var(--green)",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        ৳{sale.total?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Form Step */
            <form onSubmit={handleSubmit}>
              {/* Selected Item Preview */}
              {selectedProduct && (
                <div
                  style={{
                    background: "rgba(34,197,94,0.07)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 10,
                    padding: "14px",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      margin: "0 0 10px",
                    }}
                  >
                    SELECTED ITEM
                  </p>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        background: "rgba(34,197,94,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        flexShrink: 0,
                      }}
                    >
                      {selectedProduct.img}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: 13,
                          margin: "0 0 4px",
                        }}
                      >
                        {selectedProduct.name}
                      </p>
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <Badge small color="accent">
                          {selectedProduct.sku}
                        </Badge>
                        <Badge small color="blue">
                          {selectedProduct.category}
                        </Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          color: "var(--green)",
                          fontWeight: 800,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        ৳{productPrice.toLocaleString()}
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 10,
                          margin: 0,
                        }}
                      >
                        Stock: {selectedProduct.stock}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                    }}
                  >
                    INVOICE *
                  </label>
                  <input
                    type="text"
                    value={selectedSale?.inv || ""}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: `1px solid ${errors.sale_id ? "#f87171" : "var(--border)"}`,
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: 12,
                      fontFamily: "'Open Sans', sans-serif",
                      cursor: "not-allowed",
                    }}
                  />
                  {errors.sale_id && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.sale_id}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                    }}
                  >
                    CUSTOMER *
                  </label>
                  <input
                    type="text"
                    value={selectedSale?.customer || ""}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: 12,
                      fontFamily: "'Open Sans', sans-serif",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                    }}
                  >
                    QUANTITY *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleChange("quantity", parseInt(e.target.value) || 1)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: `1px solid ${errors.quantity ? "#f87171" : "var(--border)"}`,
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: 12,
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.quantity && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "var(--text-secondary)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                    }}
                  >
                    REFUND AMOUNT (৳) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.refund_amount}
                    onChange={(e) =>
                      handleChange("refund_amount", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "var(--bg-secondary)",
                      border: `1px solid ${errors.refund_amount ? "#f87171" : "var(--border)"}`,
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: 12,
                      outline: "none",
                      fontFamily: "'Open Sans', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.refund_amount && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.refund_amount}
                    </p>
                  )}
                </div>
              </div>

              {/* Calculated Total */}
              <div
                style={{
                  background: "rgba(172,82,8,0.08)",
                  border: "1px solid rgba(172,82,8,0.2)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>
                  Calculated Total
                </span>
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  ৳{calculatedTotal.toLocaleString()}
                </span>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    marginBottom: 6,
                  }}
                >
                  REASON FOR RETURN *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  placeholder="Describe why this item is being returned..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--bg-secondary)",
                    border: `1px solid ${errors.reason ? "#f87171" : "var(--border)"}`,
                    borderRadius: 8,
                    color: "var(--text-primary)",
                    fontSize: 12,
                    outline: "none",
                    fontFamily: "'Open Sans', sans-serif",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                {errors.reason && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: 10,
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.reason}
                  </p>
                )}
              </div>

              {/* Hidden DB Fields (for reference) */}
              <input
                type="hidden"
                name="sale_id"
                value={formData.sale_id || ""}
              />
              <input
                type="hidden"
                name="product_id"
                value={formData.product_id || ""}
              />
              <input
                type="hidden"
                name="approved_by"
                value={formData.approved_by}
              />
              <input type="hidden" name="status" value={formData.status} />
              <input
                type="hidden"
                name="return_date"
                value={formData.return_date}
              />

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <Btn
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("search");
                    setSelectedSale(null);
                    setSelectedProduct(null);
                  }}
                  style={{ flex: 1, justifyContent: "center" }}
                  disabled={isSubmitting}
                >
                  ← Back
                </Btn>
                <Btn
                  type="submit"
                  disabled={isSubmitting}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />{" "}
                      Creating...
                    </>
                  ) : (
                    <>
                      <Ic.Check /> Create Return
                    </>
                  )}
                </Btn>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function SaleReturnsPage() {
  const [returns, setReturns] = useState(RETURNS);
  const [selected, setSelected] = useState(new Set());
  const [viewReturn, setViewReturn] = useState(null);
  const [showNewReturn, setShowNewReturn] = useState(false);

  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === returns.length
        ? new Set()
        : new Set(returns.map((r) => r.id)),
    );
  const approve = (id) =>
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
  const reject = (id) =>
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );

  const bulkApprove = () => {
    setReturns((prev) =>
      prev.map((r) =>
        selected.has(r.id) && r.status === "pending"
          ? { ...r, status: "approved" }
          : r,
      ),
    );
    setSelected(new Set());
  };

  const handleCreateReturn = (newReturn) => {
    setReturns((prev) => [newReturn, ...prev]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Returns",
            value: returns.length,
            color: "var(--accent)",
            icon: "↩️",
          },
          {
            label: "Refund Amount",
            value: `৳${returns.reduce((a, r) => a + (r.amount || r.refund_amount || 0), 0).toLocaleString()}`,
            color: "#f87171",
            icon: "💸",
          },
          {
            label: "Approved",
            value: returns.filter((r) => r.status === "approved").length,
            color: "#fbbf24",
            icon: "✅",
          },
          {
            label: "Completed",
            value: returns.filter((r) => r.status === "completed").length,
            color: "var(--green)",
            icon: "🎉",
          },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              ...card(),
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${k.color === "var(--green)" ? "rgba(34,197,94," : k.color === "#f87171" ? "rgba(248,113,113," : k.color === "#fbbf24" ? "rgba(251,191,36," : "rgba(172,82,8,"}0.1)`,
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
                  color: "var(--text-muted)",
                  fontSize: 10,
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: k.color,
                  fontSize: 20,
                  fontWeight: 800,
                  margin: "2px 0 0",
                }}
              >
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
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
            animation: "slideUp 0.2s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <Badge color="accent">{selected.size} selected</Badge>
          <div style={{ flex: 1 }} />
          <Btn variant="success" size="sm" onClick={bulkApprove}>
            <Ic.Check /> Bulk Approve
          </Btn>
          <Btn
            variant="danger"
            size="sm"
            onClick={() => setSelected(new Set())}
          >
            <Ic.Close /> Clear
          </Btn>
        </div>
      )}

      {/* Table */}
      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 13,
                margin: 0,
              }}
            >
              Sale Returns
            </h3>
            <Badge color="red" small>
              {returns.filter((r) => r.status === "pending").length} pending
            </Badge>
          </div>
          <Btn size="sm" onClick={() => setShowNewReturn(true)}>
            <Ic.Plus /> New Return
          </Btn>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "var(--bg-secondary)" }}>
            <tr>
              <th style={{ padding: "11px 14px", width: 32 }}>
                <input
                  type="checkbox"
                  checked={
                    selected.size === returns.length && returns.length > 0
                  }
                  onChange={toggleAll}
                  style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                />
              </th>
              {[
                "Return ID",
                "Invoice",
                "Customer",
                "Product",
                "Qty",
                "Refund",
                "Reason",
                "Status",
                "Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 10px",
                    color: "var(--text-muted)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    textAlign: "left",
                    letterSpacing: "0.07em",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: selected.has(r.id)
                    ? "rgba(172,82,8,0.06)"
                    : "transparent",
                  transition: "background .12s",
                }}
                onMouseEnter={(e) => {
                  if (!selected.has(r.id))
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (!selected.has(r.id))
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "10px 14px" }}>
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                    style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                  />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "#f87171",
                      fontWeight: 700,
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {r.ret}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "var(--accent)",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {r.inv}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span style={{ color: "var(--text-primary)", fontSize: 12 }}>
                    {r.customer}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 11 }}
                  >
                    {r.product}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge color="yellow" small>
                    {r.qty} unit{r.qty > 1 ? "s" : ""}
                  </Badge>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: "#f87171", fontWeight: 700, fontSize: 12 }}
                  >
                    ৳{(r.amount || r.refund_amount)?.toLocaleString()}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 11,
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {r.reason}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <StatusBadge status={r.status} />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 11 }}
                  >
                    {r.date || r.return_date?.toISOString?.()?.split("T")[0]}
                  </span>
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {r.status === "pending" && (
                      <>
                        <button
                          title="Approve"
                          onClick={() => approve(r.id)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.2)",
                            color: "var(--green)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all .15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(34,197,94,0.2)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(34,197,94,0.1)")
                          }
                        >
                          <Ic.Check />
                        </button>
                        <button
                          title="Reject"
                          onClick={() => reject(r.id)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: "rgba(248,113,113,0.1)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "#f87171",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all .15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(248,113,113,0.2)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(248,113,113,0.1)")
                          }
                        >
                          <Ic.Close />
                        </button>
                      </>
                    )}
                    <button
                      title="View Details"
                      onClick={() => setViewReturn(r)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.2)",
                        color: "#60a5fa",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(96,165,250,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(96,165,250,0.1)")
                      }
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

      {/* Modals */}
      {viewReturn && (
        <ReturnDetailModal
          ret={viewReturn}
          onClose={() => setViewReturn(null)}
          onApprove={approve}
          onReject={reject}
        />
      )}
      {showNewReturn && (
        <NewReturnModal
          onClose={() => setShowNewReturn(false)}
          onSubmit={handleCreateReturn}
        />
      )}
    </div>
  );
}
