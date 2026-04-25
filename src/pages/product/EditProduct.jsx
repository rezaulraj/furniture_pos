import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { T, card } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useProductStore } from "../../store/productStore";
import { useCategoryStore } from "../../store/categoryStore";

const EMPTY = {
  sku: "",
  product_name: "",
  image_url: "",
  description: "",
  category_id: "",
  cost_price: "",
  selling_price: "",
  dimensions: "",
  material: "",
  color: "",
  brand: "",
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    products,
    fetchProducts,
    updateProduct,
    isLoading,
    isSubmitting,
    error: productError,
    clearError: clearProductError,
  } = useProductStore();

  const {
    categories,
    fetchCategories,
    isLoading: categoriesLoading,
    error: categoryError,
  } = useCategoryStore();

  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [savedProduct, setSavedProduct] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchCategories({ is_active: true });
    clearProductError();
  }, [fetchCategories, clearProductError]);

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const currentProduct = useMemo(
    () => products.find((item) => Number(item.product_id) === Number(id)),
    [products, id],
  );

  useEffect(() => {
    if (currentProduct && !initialized) {
      setForm({
        sku: currentProduct.sku || "",
        product_name: currentProduct.product_name || "",
        image_url: currentProduct.image_url || "",
        description: currentProduct.description || "",
        category_id: currentProduct.category_id
          ? String(currentProduct.category_id)
          : "",
        cost_price:
          currentProduct.cost_price !== undefined &&
          currentProduct.cost_price !== null
            ? String(currentProduct.cost_price)
            : "",
        selling_price:
          currentProduct.selling_price !== undefined &&
          currentProduct.selling_price !== null
            ? String(currentProduct.selling_price)
            : "",
        dimensions: currentProduct.dimensions || "",
        material: currentProduct.material || "",
        color: currentProduct.color || "",
        brand: currentProduct.brand || "",
      });
      setInitialized(true);
    }
  }, [currentProduct, initialized]);

  const activeCategories = useMemo(
    () => categories.filter((item) => item.is_active),
    [categories],
  );

  const marginInfo = useMemo(() => {
    const cost = Number(form.cost_price);
    const sell = Number(form.selling_price);

    if (!cost || !sell || cost <= 0 || sell <= 0) return null;

    const profit = sell - cost;
    const margin = ((profit / cost) * 100).toFixed(1);

    return {
      profit,
      margin,
    };
  }, [form.cost_price, form.selling_price]);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFormError("");
  };

  const validate = () => {
    if (!form.sku.trim()) return "SKU is required";
    if (form.sku.trim().length < 3) return "SKU must be at least 3 characters";
    if (!form.product_name.trim()) return "Product name is required";
    if (!form.category_id) return "Category is required";

    const cost = Number(form.cost_price);
    const sell = Number(form.selling_price);

    if (!form.cost_price || Number.isNaN(cost) || cost <= 0) {
      return "Valid cost price is required";
    }

    if (!form.selling_price || Number.isNaN(sell) || sell <= 0) {
      return "Valid selling price is required";
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const payload = {
        sku: form.sku.trim(),
        product_name: form.product_name.trim(),
        image_url: form.image_url.trim(),
        description: form.description.trim(),
        category_id: Number(form.category_id),
        cost_price: Number(form.cost_price),
        selling_price: Number(form.selling_price),
        dimensions: form.dimensions.trim(),
        material: form.material.trim(),
        color: form.color.trim(),
        brand: form.brand.trim(),
      };

      const product = await updateProduct(Number(id), payload);
      setSavedProduct(product);
    } catch {
      // store error handles ui
    }
  };

  if (savedProduct) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 460,
          gap: 18,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.10)",
            border: "2px solid rgba(34,197,94,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
        >
          ✅
        </div>

        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 24,
              margin: "0 0 8px",
            }}
          >
            Product Updated
          </h2>
          <p
            style={{
              color: T.textSub,
              fontSize: 13,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: T.accent }}>
              {savedProduct.product_name}
            </strong>{" "}
            has been updated successfully.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => navigate("/products")}>
            <Ic.Eye /> View Products
          </Btn>
          <Btn
            onClick={() =>
              navigate(`/products/edit/${savedProduct.product_id}`)
            }
          >
            <Ic.Edit /> Continue Editing
          </Btn>
        </div>
      </div>
    );
  }

  if (isLoading && !currentProduct) {
    return (
      <div
        style={{
          ...card(),
          padding: 28,
          textAlign: "center",
          color: T.textSub,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Loading product...
      </div>
    );
  }

  if (!isLoading && !currentProduct && initialized) {
    return (
      <div
        style={{
          ...card(),
          padding: 34,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 10 }}>📦</div>
        <p
          style={{
            color: T.text,
            fontSize: 16,
            fontWeight: 800,
            margin: "0 0 6px",
          }}
        >
          Product not found
        </p>
        <p
          style={{
            color: T.textSub,
            fontSize: 12.5,
            margin: 0,
          }}
        >
          This product may have been deleted or not loaded yet.
        </p>
        <Btn onClick={() => navigate("/products")} style={{ marginTop: 16 }}>
          Back to Products
        </Btn>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 920,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg,#ac5208,#7a3a06)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(172,82,8,0.35)",
            fontSize: 22,
          }}
        >
          ✏️
        </div>

        <div>
          <h1
            style={{
              color: T.text,
              fontWeight: 900,
              fontSize: 22,
              margin: 0,
            }}
          >
            Edit Product
          </h1>
          <p
            style={{
              color: T.textSub,
              fontSize: 12,
              margin: "4px 0 0",
            }}
          >
            Update product information using supported backend fields only
          </p>
        </div>

        <Btn
          variant="ghost"
          onClick={() => navigate("/products")}
          style={{ marginLeft: "auto" }}
        >
          <Ic.Close /> Cancel
        </Btn>
      </div>

      {(formError || productError || categoryError) && (
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
          {formError || productError || categoryError}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            ...card(),
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <Field label="SKU *">
              <input
                value={form.sku}
                onChange={setField("sku")}
                placeholder="e.g. SOF-101"
                style={inputStyle()}
              />
            </Field>

            <Field label="Category *">
              <select
                value={form.category_id}
                onChange={setField("category_id")}
                style={inputStyle()}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading..." : "Select category"}
                </option>
                {activeCategories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                    style={{ background: T.bg3 }}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label="Product Name *">
              <input
                value={form.product_name}
                onChange={setField("product_name")}
                placeholder="Enter product name"
                style={inputStyle()}
              />
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={setField("description")}
                placeholder="Write short product description"
                style={textareaStyle()}
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <Field label="Cost Price *">
              <input
                type="number"
                value={form.cost_price}
                onChange={setField("cost_price")}
                placeholder="0.00"
                style={inputStyle()}
              />
            </Field>

            <Field label="Selling Price *">
              <input
                type="number"
                value={form.selling_price}
                onChange={setField("selling_price")}
                placeholder="0.00"
                style={inputStyle()}
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <Field label="Brand">
              <input
                value={form.brand}
                onChange={setField("brand")}
                placeholder="e.g. WoodCraft"
                style={inputStyle()}
              />
            </Field>

            <Field label="Material">
              <input
                value={form.material}
                onChange={setField("material")}
                placeholder="e.g. Teak Wood"
                style={inputStyle()}
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <Field label="Color">
              <input
                value={form.color}
                onChange={setField("color")}
                placeholder="e.g. Walnut Brown"
                style={inputStyle()}
              />
            </Field>

            <Field label="Dimensions">
              <input
                value={form.dimensions}
                onChange={setField("dimensions")}
                placeholder="e.g. 220×90×85 cm"
                style={inputStyle()}
              />
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label="Image URL">
              <input
                value={form.image_url}
                onChange={setField("image_url")}
                placeholder="https://example.com/product.jpg"
                style={inputStyle()}
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <Btn variant="ghost" onClick={() => navigate("/products")}>
              Cancel
            </Btn>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                border: "none",
                borderRadius: 12,
                background: T.accent,
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                padding: "12px 18px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 10px 24px rgba(172,82,8,0.30)",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div
          style={{
            ...card(),
            padding: "20px 20px 18px",
            position: "sticky",
            top: 16,
          }}
        >
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              margin: "0 0 12px",
            }}
          >
            LIVE PREVIEW
          </p>

          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(180deg, ${T.bg3}, ${T.bg2})`,
              padding: 16,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 180,
                borderRadius: 14,
                background: "rgba(172,82,8,0.08)",
                border: `1px dashed ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: 14,
              }}
            >
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt={form.product_name || "Product preview"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 38,
                    opacity: 0.7,
                  }}
                >
                  📦
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "rgba(172,82,8,0.12)",
                  color: T.accent,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {activeCategories.find(
                  (item) =>
                    Number(item.category_id) === Number(form.category_id),
                )?.category_name || "No Category"}
              </span>
            </div>

            <h3
              style={{
                color: T.text,
                margin: "0 0 4px",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              {form.product_name || "Product name"}
            </h3>

            <p
              style={{
                color: T.textMut,
                margin: "0 0 12px",
                fontSize: 11,
                fontFamily: "monospace",
              }}
            >
              {form.sku || "SKU-NOT-SET"}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <PreviewStat
                label="Cost"
                value={form.cost_price ? `৳${form.cost_price}` : "—"}
              />
              <PreviewStat
                label="Sell"
                value={form.selling_price ? `৳${form.selling_price}` : "—"}
              />
            </div>

            {marginInfo && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.18)",
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: T.green,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  Profit ৳{marginInfo.profit.toLocaleString()} • Margin{" "}
                  {marginInfo.margin}%
                </p>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                ["Brand", form.brand || "—"],
                ["Material", form.material || "—"],
                ["Color", form.color || "—"],
                ["Dimensions", form.dimensions || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
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
              ))}
            </div>

            {form.description && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    color: T.textSub,
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {form.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          color: T.textSub,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.06em",
        }}
      >
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(172,82,8,0.06)",
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
          fontSize: 16,
          fontWeight: 900,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
  };
}

function textareaStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: T.bg3,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    color: T.text,
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
  };
}
