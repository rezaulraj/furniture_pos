import { useEffect, useMemo, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useCategoryStore } from "../../store/categoryStore";

const emptyForm = {
  category_name: "",
  description: "",
  is_active: true,
};

const CategoryModal = ({
  mode,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
  error,
}) => {
  const isEdit = mode === "edit";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                color: T.text,
                margin: 0,
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              {isEdit ? "Edit Category" : "Create Category"}
            </h2>
            <p
              style={{
                color: T.textSub,
                margin: "4px 0 0",
                fontSize: 12,
              }}
            >
              Only necessary fields are shown
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.bg3,
              color: T.textSub,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            {Ic.Close ? <Ic.Close /> : <span style={{ fontSize: 18 }}>×</span>}
          </button>
        </div>

        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.22)",
                color: T.red,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

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
              CATEGORY NAME *
            </label>
            <input
              value={form.category_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
              placeholder="Enter category name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: T.bg3,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                color: T.text,
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

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
              DESCRIPTION
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional description"
              style={{
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
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: 12,
              background: form.is_active
                ? "rgba(34,197,94,0.08)"
                : "rgba(248,113,113,0.08)",
              border: `1px solid ${
                form.is_active
                  ? "rgba(34,197,94,0.20)"
                  : "rgba(248,113,113,0.20)"
              }`,
            }}
          >
            <div>
              <p
                style={{
                  color: T.text,
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                Status
              </p>
              <p
                style={{
                  color: T.textSub,
                  margin: "3px 0 0",
                  fontSize: 11,
                }}
              >
                {form.is_active ? "Active category" : "Inactive category"}
              </p>
            </div>

            <button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  is_active: !prev.is_active,
                }))
              }
              style={{
                width: 50,
                height: 28,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: form.is_active ? T.green : T.textMut,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  left: form.is_active ? 26 : 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left .2s ease",
                }}
              />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 10,
          }}
        >
          <Btn
            variant="ghost"
            onClick={onClose}
            style={{ flex: 1, justifyContent: "center" }}
          >
            Cancel
          </Btn>

          <button
            onClick={onSubmit}
            disabled={loading}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 12,
              background: T.accent,
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ category, loading, onClose, onConfirm }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          ...card(),
          width: "100%",
          maxWidth: 420,
          padding: 24,
          boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            margin: "0 auto 16px",
            borderRadius: 16,
            background: "rgba(248,113,113,0.10)",
            border: "1px solid rgba(248,113,113,0.25)",
            display: "grid",
            placeItems: "center",
            fontSize: 28,
          }}
        >
          ⚠️
        </div>

        <h3
          style={{
            textAlign: "center",
            color: T.text,
            margin: 0,
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          Delete Category?
        </h3>

        <p
          style={{
            textAlign: "center",
            color: T.textSub,
            fontSize: 13,
            lineHeight: 1.6,
            margin: "10px 0 22px",
          }}
        >
          This will mark{" "}
          <strong style={{ color: T.text }}>{category?.category_name}</strong>{" "}
          as inactive.
        </p>

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
              border: "none",
              borderRadius: 12,
              background: "linear-gradient(135deg,#dc2626,#991b1b)",
              color: "#fff",
              fontWeight: 800,
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
};

export default function Categories() {
  const {
    categories,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    clearError,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [modalMode, setModalMode] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.category_name?.toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusF === "all" ||
        (statusF === "active" ? c.is_active : !c.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusF]);

  const openCreate = () => {
    setModalMode("create");
    setActiveCategory(null);
    setForm(emptyForm);
    setSubmitError("");
    clearError();
  };

  const openEdit = (category) => {
    setModalMode("edit");
    setActiveCategory(category);
    setForm({
      category_name: category.category_name || "",
      description: category.description || "",
      is_active: Boolean(category.is_active),
    });
    setSubmitError("");
    clearError();
  };

  const openDelete = (category) => {
    setModalMode("delete");
    setActiveCategory(category);
    clearError();
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveCategory(null);
    setForm(emptyForm);
    setSubmitError("");
    clearError();
  };

  const handleCreate = async () => {
    if (!form.category_name.trim()) {
      setSubmitError("Category name is required");
      return;
    }

    try {
      await createCategory({
        category_name: form.category_name.trim(),
        description: form.description?.trim() || "",
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setSubmitError(
        useCategoryStore.getState().error || "Failed to create category",
      );
    }
  };

  const handleUpdate = async () => {
    if (!form.category_name.trim()) {
      setSubmitError("Category name is required");
      return;
    }

    try {
      await updateCategory(activeCategory.category_id, {
        category_name: form.category_name.trim(),
        description: form.description?.trim() || "",
        is_active: form.is_active,
      });
      closeModal();
    } catch {
      setSubmitError(
        useCategoryStore.getState().error || "Failed to update category",
      );
    }
  };

  const handleDelete = async () => {
    if (!activeCategory) return;

    try {
      await deleteCategory(activeCategory.category_id);
      closeModal();
    } catch {
      // page-level store error will show automatically
    }
  };

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.is_active).length;
  const inactiveCount = categories.filter((c) => !c.is_active).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Categories",
            value: totalCount,
            sub: "All categories",
            color: T.accent,
          },
          {
            label: "Active",
            value: activeCount,
            sub: "Currently visible",
            color: T.green,
          },
          {
            label: "Inactive",
            value: inactiveCount,
            sub: "Soft deleted / hidden",
            color: T.red,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              ...card(),
              padding: "16px 18px",
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <p
              style={{
                color: T.textSub,
                margin: 0,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
              }}
            >
              {item.label.toUpperCase()}
            </p>
            <p
              style={{
                color: T.text,
                margin: "6px 0 3px",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                color: T.textMut,
                margin: 0,
                fontSize: 11,
              }}
            >
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
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
            placeholder="Search category..."
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

        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["all", "All"],
            ["active", "Active"],
            ["inactive", "Inactive"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatusF(value)}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 999,
                border: `1px solid ${
                  statusF === value ? "transparent" : T.border
                }`,
                background:
                  statusF === value
                    ? `linear-gradient(135deg, ${T.accent}, ${T.accent})`
                    : T.bg3,
                color: statusF === value ? "#fff" : T.textSub,
                fontWeight: 800,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <Btn onClick={openCreate}>
          <Ic.Plus /> New Category
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

      <div style={{ ...card(), overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2fr 120px 140px",
            gap: 12,
            padding: "14px 16px",
            background: T.bg2,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {["Category", "Description", "Status", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                color: T.textMut,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
              }}
            >
              {h.toUpperCase()}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              color: T.textSub,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Loading categories...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 46, marginBottom: 10 }}>🗂️</div>
            <p
              style={{
                margin: 0,
                color: T.textSub,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              No categories found
            </p>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={openCreate}>
                <Ic.Plus /> Create Category
              </Btn>
            </div>
          </div>
        ) : (
          filtered.map((category) => (
            <div
              key={category.category_id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 2fr 120px 140px",
                gap: 12,
                padding: "14px 16px",
                borderBottom: `1px solid ${T.border}`,
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: T.text,
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  {category.category_name}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: T.textSub,
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {category.description || "—"}
                </p>
              </div>

              <div>
                <Badge color={category.is_active ? "green" : "red"} small>
                  {category.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openEdit(category)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    background: T.bg3,
                    color: T.accent,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                  title="Edit"
                >
                  <Ic.Edit />
                </button>

                <button
                  onClick={() => openDelete(category)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: `1px solid rgba(248,113,113,0.20)`,
                    background: "rgba(248,113,113,0.08)",
                    color: T.red,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                  title="Delete"
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <CategoryModal
          mode={modalMode}
          form={form}
          setForm={setForm}
          loading={isSubmitting}
          onClose={closeModal}
          onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
          error={submitError}
        />
      )}

      {modalMode === "delete" && activeCategory && (
        <DeleteModal
          category={activeCategory}
          loading={isDeleting}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
