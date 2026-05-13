import { T } from "../theme/colors";
import { Ic } from "./Icons";

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = meta;

  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px",
        marginTop: 12,
      }}
    >
      <div style={{ color: T.textMut, fontSize: 13 }}>
        Showing <span style={{ color: T.text, fontWeight: 700 }}>{startRange}-{endRange}</span> of <span style={{ color: T.text, fontWeight: 700 }}>{total}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          style={btnStyle(page === 1)}
        >
          <Ic.ArrowLeft size={16} />
        </button>

        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnStyle(false),
              width: 36,
              background: p === page ? T.accent : T.bg3,
              color: p === page ? "#fff" : T.text,
              border: p === page ? "none" : `1px solid ${T.border}`,
            }}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          style={btnStyle(page === totalPages)}
        >
          <Ic.ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const btnStyle = (disabled) => ({
  height: 36,
  minWidth: 36,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: T.bg3,
  border: `1px solid ${T.border}`,
  color: disabled ? T.textMut : T.text,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.2s",
  opacity: disabled ? 0.5 : 1,
});
