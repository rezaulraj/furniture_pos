// ── Theme Color Tokens ─────────────────────────────────────────────
// Dark mode: #040d1c bg, #ac5208 accent, white/green text
// Light mode: mint/sage greens

const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

// Always export static dark tokens (runtime theme handled via CSS vars)
export const T = {
  // Backgrounds
  bg1: "var(--bg-base)", // #040d1c dark / #f0f7f4 light
  bg2: "var(--bg-secondary)", // #060f22 dark / #e4f0eb light
  bg3: "var(--surface)", // #0a1628 dark / #ffffff light
  bgAlt: "var(--surface-alt)", // #0d1e35 dark / #f7fcf9 light

  // Text
  text: "var(--text-primary)", // #f0faff dark / #0a1f14 light
  textSub: "var(--text-secondary)", // #a8d4c2 dark / #3d7a5a light
  textMut: "var(--text-muted)", // #4a7a62 dark / #6aaa88 light

  // Accent (buttons, highlights)
  accent: "var(--accent)", // #ac5208
  gold: "var(--accent)", // alias — replaces old brown/gold
  amber: "var(--accent)", // alias

  // Green
  green: "var(--green)", // #22c55e dark / #16a34a light

  // Semantic
  blue: "#60a5fa",
  yellow: "#fbbf24",
  red: "#f87171",
  border: "var(--border)",

  // Static hex for inline dropdowns/portals that can't use CSS vars
  darkBg: "#040d1c",
  darkSurface: "#0a1628",
  darkBorder: "rgba(255,255,255,0.07)",
};

// card() — returns a style object for card containers
export const card = (extra = {}) => ({
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  ...extra,
});
