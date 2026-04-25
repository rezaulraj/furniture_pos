import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useProductStore } from "../../store/productStore";
import { useCategoryStore } from "../../store/categoryStore";

const currency = (value) => {
  const num = Number(value || 0);
  return `৳${num.toLocaleString()}`;
};

const ViewModal = ({ product, onClose, onEdit }) => {
  const margin =
    product?.cost_price && product?.selling_price
      ? (
          ((Number(product.selling_price) - Number(product.cost_price)) /
            Number(product.cost_price)) *
          100
        ).toFixed(1)
      : null;

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
        backdropFilter: "blur(5px)",
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            padding: "22px 22px 16px",
            background: "linear-gradient(135deg,#1e1208,#2d1a09)",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 14, flex: 1 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: "rgba(172,82,8,0.12)",
                  border: "1px solid rgba(172,82,8,0.24)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {product?.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 28 }}>📦</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color={product?.is_active ? "green" : "red"} small>
                    {product?.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                  {product?.category?.category_name && (
                    <Badge color="purple" small>
                      {product.category.category_name}
                    </Badge>
                  )}
                </div>

                <h2
                  style={{
                    color: T.text,
                    fontWeight: 900,
                    fontSize: 18,
                    margin: "10px 0 4px",
                    lineHeight: 1.25,
                  }}
                >
                  {product?.product_name}
                </h2>

                <p
                  style={{
                    color: T.gold,
                    fontSize: 11,
                    fontFamily: "monospace",
                    margin: 0,
                  }}
                >
                  {product?.sku}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
                color: T.red,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              {Ic.Close ? (
                <Ic.Close />
              ) : (
                <span style={{ fontSize: 18 }}>×</span>
              )}
            </button>
          </div>
        </div>

        <div
          style={{
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            <InfoStat
              label="Cost Price"
              value={currency(product?.cost_price)}
              color={T.blue}
            />
            <InfoStat
              label="Selling Price"
              value={currency(product?.selling_price)}
              color={T.green}
            />
            <InfoStat
              label="Margin"
              value={margin ? `${margin}%` : "—"}
              color={T.accent}
            />
          </div>

          <div
            style={{
              ...card(),
              padding: "14px 16px",
            }}
          >
            <SectionTitle>DETAILS</SectionTitle>
            <DetailRow label="Brand" value={product?.brand || "—"} />
            <DetailRow label="Material" value={product?.material || "—"} />
            <DetailRow label="Color" value={product?.color || "—"} />
            <DetailRow label="Dimensions" value={product?.dimensions || "—"} />
            <DetailRow
              label="Category"
              value={product?.category?.category_name || "—"}
            />
            <DetailRow
              label="Created"
              value={
                product?.created_at
                  ? new Date(product.created_at).toLocaleDateString()
                  : "—"
              }
            />
          </div>

          {product?.description && (
            <div
              style={{
                ...card(),
                padding: "14px 16px",
              }}
            >
              <SectionTitle>DESCRIPTION</SectionTitle>
              <p
                style={{
                  color: T.textSub,
                  fontSize: 12.5,
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {product.description}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn
              variant="ghost"
              onClick={onClose}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Close
            </Btn>
            <Btn
              onClick={() => onEdit(product)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Ic.Edit /> Edit Product
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ product, loading, onClose, onConfirm }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.78)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)",
      padding: 16,
    }}
  >
    <div
      style={{
        ...card(),
        width: "100%",
        maxWidth: 430,
        padding: "28px 26px",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "rgba(239,68,68,0.12)",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          margin: "0 auto 18px",
        }}
      >
        🗑️
      </div>

      <h3
        style={{
          color: T.text,
          fontWeight: 900,
          fontSize: 18,
          margin: "0 0 8px",
        }}
      >
        Delete Product?
      </h3>

      <p
        style={{
          color: T.textSub,
          fontSize: 13,
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        You're about to delete{" "}
        <strong style={{ color: T.text }}>{product?.product_name}</strong>.
      </p>

      <div
        style={{
          padding: "12px 14px",
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.22)",
          borderRadius: 10,
          marginBottom: 20,
          textAlign: "left",
        }}
      >
        <p
          style={{
            color: T.text,
            fontWeight: 700,
            fontSize: 12.5,
            margin: 0,
          }}
        >
          {product?.product_name}
        </p>
        <p
          style={{
            color: T.textSub,
            fontSize: 10.5,
            margin: "4px 0 0",
          }}
        >
          {product?.sku} • {product?.category?.category_name || "No Category"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn
          variant="ghost"
          onClick={onClose}
          style={{ flex: 1, justifyContent: "center" }}
        >
          Cancel
        </Btn>

        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            background: "linear-gradient(135deg,#dc2626,#991b1b)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default function Products() {
  const navigate = useNavigate();

  const {
    products,
    isLoading,
    isDeleting,
    error,
    clearError,
    fetchProducts,
    deleteProduct,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [categoryF, setCategoryF] = useState("all");
  const [sortField, setSortField] = useState("product_name");
  const [sortDir, setSortDir] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [activeProduct, setActiveProduct] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories({ is_active: true });
    clearError();
  }, [fetchProducts, fetchCategories, clearError]);

  const categoryOptions = useMemo(
    () => [{ category_id: "all", category_name: "All" }, ...categories],
    [categories],
  );

  const filtered = useMemo(() => {
    let items = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q),
      );
    }

    if (categoryF !== "all") {
      items = items.filter((p) => Number(p.category_id) === Number(categoryF));
    }

    items.sort((a, b) => {
      const aVal = a?.[sortField] ?? "";
      const bVal = b?.[sortField] ?? "";

      const numericFields = ["selling_price", "cost_price"];
      if (numericFields.includes(sortField)) {
        return sortDir === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return items;
  }, [products, search, categoryF, sortField, sortDir]);

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.is_active).length;
  const inactiveCount = products.filter((p) => !p.is_active).length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.selling_price || 0),
    0,
  );

  const openView = (product) => {
    setActiveProduct(product);
    setModalMode("view");
  };

  const openDelete = (product) => {
    setActiveProduct(product);
    setModalMode("delete");
  };

  const closeModal = () => {
    setActiveProduct(null);
    setModalMode(null);
  };

  const handleDelete = async () => {
    if (!activeProduct) return;
    try {
      await deleteProduct(activeProduct.product_id);
      closeModal();
    } catch {
      // store error will show
    }
  };

  const sortBy = (field) => {
    if (field === sortField) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortArrow = ({ field }) => (
    <span
      style={{
        color: sortField === field ? T.accent : T.textMut,
        fontSize: 10,
        marginLeft: 4,
      }}
    >
      {sortField === field ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#3a2010;border-radius:99px}
        @keyframes cardIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Products",
            value: totalProducts,
            sub: `${activeCount} active`,
            color: T.accent,
            icon: "📦",
          },
          {
            label: "Inventory Value",
            value: currency(totalValue),
            sub: "At selling price",
            color: T.green,
            icon: "💰",
          },
          {
            label: "Inactive",
            value: inactiveCount,
            sub: "Hidden products",
            color: T.red,
            icon: "🚫",
          },
          {
            label: "Categories",
            value: categories.length,
            sub: "Available groups",
            color: T.blue,
            icon: "🗂️",
          },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              ...card(),
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderLeft: `4px solid ${k.color}`,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `${k.color}18`,
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
                  fontSize: 10,
                  margin: 0,
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                }}
              >
                {k.label.toUpperCase()}
              </p>
              <p
                style={{
                  color: T.text,
                  fontSize: 22,
                  fontWeight: 900,
                  margin: "2px 0",
                }}
              >
                {k.value}
              </p>
              <p style={{ color: T.textMut, fontSize: 10.5, margin: 0 }}>
                {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "0 12px",
            height: 42,
          }}
        >
          <span style={{ color: T.textMut, display: "flex" }}>
            <Ic.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, brand..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: T.text,
              fontSize: 13,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categoryOptions.map((c) => (
            <button
              key={c.category_id}
              onClick={() => setCategoryF(String(c.category_id))}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 11,
                background:
                  String(categoryF) === String(c.category_id)
                    ? "linear-gradient(135deg,#c0712a,#8b3e10)"
                    : "rgba(139,90,43,0.1)",
                border: `1px solid ${
                  String(categoryF) === String(c.category_id)
                    ? "transparent"
                    : T.border
                }`,
                color:
                  String(categoryF) === String(c.category_id)
                    ? "#fff"
                    : T.textSub,
                transition: "all .15s",
              }}
            >
              {c.category_name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 5 }}>
          {["grid", "table"].map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${viewMode === v ? T.accent : T.border}`,
                background: viewMode === v ? "rgba(172,82,8,0.15)" : T.bg3,
                color: viewMode === v ? T.accent : T.textSub,
                cursor: "pointer",
                fontSize: 15,
                display: "grid",
                placeItems: "center",
              }}
            >
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>

        <Btn onClick={() => navigate("/products/add")}>
          <Ic.Plus /> Add Product
        </Btn>
      </div>

      {error && (
        <div
          style={{
            ...card(),
            padding: "12px 14px",
            borderLeft: `4px solid ${T.red}`,
            color: T.red,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: T.textSub, fontSize: 12, margin: 0 }}>
          Showing <strong style={{ color: T.text }}>{filtered.length}</strong>{" "}
          of {products.length} products
        </p>

        <div style={{ display: "flex", gap: 6 }}>
          <SortChip
            onClick={() => sortBy("product_name")}
            active={sortField === "product_name"}
          >
            Name <SortArrow field="product_name" />
          </SortChip>
          <SortChip
            onClick={() => sortBy("selling_price")}
            active={sortField === "selling_price"}
          >
            Price <SortArrow field="selling_price" />
          </SortChip>
          <SortChip onClick={() => sortBy("sku")} active={sortField === "sku"}>
            SKU <SortArrow field="sku" />
          </SortChip>
        </div>
      </div>

      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
            gap: 14,
          }}
        >
          {isLoading ? (
            <LoadingState />
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={() => navigate("/products/add")} />
          ) : (
            filtered.map((p, idx) => {
              const margin =
                p.cost_price && p.selling_price
                  ? (
                      ((Number(p.selling_price) - Number(p.cost_price)) /
                        Number(p.cost_price)) *
                      100
                    ).toFixed(0)
                  : "—";

              return (
                <div
                  key={p.product_id}
                  style={{
                    ...card(),
                    padding: 16,
                    borderLeft: `3px solid ${p.is_active ? T.accent : T.textMut}`,
                    animation: `cardIn .25s ease ${idx * 0.03}s both`,
                    transition: "all .2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "rgba(172,82,8,0.10)",
                        border: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.product_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 24 }}>📦</span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge color={p.is_active ? "green" : "red"} small>
                        {p.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                  </div>

                  <p
                    style={{
                      color: T.text,
                      fontWeight: 800,
                      fontSize: 14,
                      margin: "0 0 4px",
                      lineHeight: 1.35,
                    }}
                  >
                    {p.product_name}
                  </p>

                  <p
                    style={{
                      color: T.gold,
                      fontSize: 10.5,
                      fontFamily: "monospace",
                      margin: "0 0 6px",
                    }}
                  >
                    {p.sku}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    {p.category?.category_name && (
                      <Badge color="purple" small>
                        {p.category.category_name}
                      </Badge>
                    )}
                    {p.brand && (
                      <Badge color="blue" small>
                        {p.brand}
                      </Badge>
                    )}
                  </div>

                  <p
                    style={{
                      color: T.textSub,
                      fontSize: 11.5,
                      margin: "0 0 12px",
                      lineHeight: 1.6,
                      minHeight: 36,
                    }}
                  >
                    {p.description || "No description"}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <MiniStat
                      label="Sell"
                      value={currency(p.selling_price)}
                      color={T.green}
                    />
                    <MiniStat
                      label="Cost"
                      value={currency(p.cost_price)}
                      color={T.blue}
                    />
                    <MiniStat
                      label="Margin"
                      value={`${margin}%`}
                      color={T.accent}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <SmallDetail label="Material" value={p.material || "—"} />
                    <SmallDetail label="Color" value={p.color || "—"} />
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openView(p)}
                      style={actionBtn("rgba(34,197,94,0.10)", T.green)}
                    >
                      <Ic.Eye /> View
                    </button>

                    <button
                      onClick={() => navigate(`/products/edit/${p.product_id}`)}
                      style={actionBtn("rgba(172,82,8,0.12)", T.accent)}
                    >
                      <Ic.Edit /> Edit
                    </button>

                    <button
                      onClick={() => openDelete(p)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "1px solid rgba(248,113,113,0.2)",
                        background: "rgba(248,113,113,0.1)",
                        color: T.red,
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Ic.Trash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 980,
              }}
            >
              <thead style={{ background: T.bg2 }}>
                <tr>
                  {[
                    ["Product", "product_name"],
                    ["SKU", "sku"],
                    ["Category", ""],
                    ["Sell Price", "selling_price"],
                    ["Cost Price", "cost_price"],
                    ["Brand", ""],
                    ["Status", ""],
                    ["Actions", ""],
                  ].map(([label, field]) => (
                    <th
                      key={label}
                      onClick={field ? () => sortBy(field) : undefined}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: T.textMut,
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        borderBottom: `1px solid ${T.border}`,
                        cursor: field ? "pointer" : "default",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label.toUpperCase()}
                      {field ? <SortArrow field={field} /> : null}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 24,
                        textAlign: "center",
                        color: T.textSub,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 40 }}>
                      <EmptyState
                        onAdd={() => navigate("/products/add")}
                        compact
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.product_id}
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <td style={td()}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 12,
                              overflow: "hidden",
                              background: "rgba(172,82,8,0.10)",
                              border: `1px solid ${T.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.product_name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: 18 }}>📦</span>
                            )}
                          </div>
                          <div>
                            <p
                              style={{
                                color: T.text,
                                fontWeight: 700,
                                fontSize: 12.5,
                                margin: 0,
                              }}
                            >
                              {p.product_name}
                            </p>
                            <p
                              style={{
                                color: T.textMut,
                                fontSize: 10,
                                margin: "3px 0 0",
                              }}
                            >
                              {p.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={tdMonospace()}>{p.sku}</td>
                      <td style={td()}>{p.category?.category_name || "—"}</td>
                      <td style={tdStrong(T.green)}>
                        {currency(p.selling_price)}
                      </td>
                      <td style={tdStrong(T.blue)}>{currency(p.cost_price)}</td>
                      <td style={td()}>{p.brand || "—"}</td>
                      <td style={td()}>
                        <Badge color={p.is_active ? "green" : "red"} small>
                          {p.is_active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </td>

                      <td style={td()}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => openView(p)}
                            style={iconBtn(T.green)}
                          >
                            <Ic.Eye />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/products/edit/${p.product_id}`)
                            }
                            style={iconBtn(T.accent)}
                          >
                            <Ic.Edit />
                          </button>
                          <button
                            onClick={() => openDelete(p)}
                            style={iconBtn(T.red, "rgba(248,113,113,0.1)")}
                          >
                            <Ic.Trash />
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
      )}

      {modalMode === "view" && activeProduct && (
        <ViewModal
          product={activeProduct}
          onClose={closeModal}
          onEdit={(product) => navigate(`/products/edit/${product.product_id}`)}
        />
      )}

      {modalMode === "delete" && activeProduct && (
        <DeleteModal
          product={activeProduct}
          loading={isDeleting}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p
      style={{
        color: T.textMut,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.09em",
        margin: "0 0 10px",
      }}
    >
      {children}
    </p>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "9px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <span style={{ color: T.textSub, fontSize: 12 }}>{label}</span>
      <span style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>
        {value}
      </span>
    </div>
  );
}

function InfoStat({ label, value, color }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: T.bg3,
        borderRadius: 10,
        border: `1px solid ${T.border}`,
        textAlign: "center",
      }}
    >
      <p style={{ color: T.textSub, fontSize: 10, margin: 0 }}>
        {label.toUpperCase()}
      </p>
      <p
        style={{
          color,
          fontSize: 16,
          fontWeight: 800,
          margin: "4px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: T.bg3,
        borderRadius: 10,
        border: `1px solid ${T.border}`,
      }}
    >
      <p
        style={{
          color: T.textMut,
          fontSize: 9.5,
          margin: 0,
          letterSpacing: "0.06em",
        }}
      >
        {label.toUpperCase()}
      </p>
      <p
        style={{
          color,
          fontSize: 14,
          fontWeight: 800,
          margin: "4px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SmallDetail({ label, value }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: T.bg3,
        border: `1px solid ${T.border}`,
      }}
    >
      <p
        style={{
          color: T.textMut,
          margin: "0 0 3px",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {label.toUpperCase()}
      </p>
      <p
        style={{
          color: T.text,
          margin: 0,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SortChip({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 11px",
        borderRadius: 20,
        background: active ? "rgba(172,82,8,0.15)" : "rgba(139,90,43,0.08)",
        border: `1px solid ${active ? "rgba(172,82,8,0.3)" : T.border}`,
        color: active ? T.accent : T.textSub,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            ...card(),
            padding: 16,
            minHeight: 300,
            opacity: 0.7,
          }}
        />
      ))}
    </>
  );
}

function EmptyState({ onAdd, compact = false }) {
  return (
    <div style={{ textAlign: "center", padding: compact ? 0 : 30 }}>
      <div style={{ fontSize: 48, marginBottom: 10 }}>🔍</div>
      <p
        style={{
          color: T.textSub,
          fontSize: 14,
          fontWeight: 700,
          margin: 0,
        }}
      >
        No products found
      </p>
      <Btn onClick={onAdd} style={{ marginTop: 14 }}>
        <Ic.Plus /> Add Product
      </Btn>
    </div>
  );
}

function actionBtn(bg, color) {
  return {
    flex: 1,
    height: 36,
    borderRadius: 10,
    background: bg,
    border: `1px solid ${T.border}`,
    color,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  };
}

function iconBtn(color, bg = "rgba(172,82,8,0.1)") {
  return {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: bg,
    border: `1px solid ${T.border}`,
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function td() {
  return {
    padding: "12px 14px",
    color: T.textSub,
    fontSize: 12,
  };
}

function tdMonospace() {
  return {
    padding: "12px 14px",
    color: T.gold,
    fontSize: 11.5,
    fontFamily: "monospace",
  };
}

function tdStrong(color) {
  return {
    padding: "12px 14px",
    color,
    fontSize: 12,
    fontWeight: 800,
  };
}
