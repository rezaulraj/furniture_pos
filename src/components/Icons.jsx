const Svg = ({ d, size = 18, sw = 1.8, fill = false, cls = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
    className={cls}
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

export const Ic = {
  Dashboard: () => (
    <Svg
      d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]}
    />
  ),
  Sale: () => (
    <Svg
      d={[
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
        "M3 6h18",
        "M16 10a4 4 0 01-8 0",
      ]}
    />
  ),
  History: () => <Svg d={["M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0"]} />,
  Return: () => <Svg d={["M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"]} />,
  Installment: () => (
    <Svg
      d={[
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
        "M9 5a2 2 0 002 2h2a2 2 0 002-2",
        "M9 12h6m-6 4h4",
      ]}
    />
  ),
  Plus: () => <Svg d="M12 5v14M5 12h14" sw={2.2} />,
  Minus: () => <Svg d="M5 12h14" sw={2.2} />,
  Search: () => <Svg d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />,
  Trash: () => (
    <Svg
      d={[
        "M3 6h18",
        "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
      ]}
    />
  ),
  Close: () => <Svg d="M6 18L18 6M6 6l12 12" sw={2.2} />,
  Check: () => <Svg d="M20 6L9 17l-5-5" sw={2.5} />,
  ChevDown: ({ open, size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0)",
        transition: "transform .22s ease",
        flexShrink: 0,
      }}
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevRight: () => <Svg d="M9 18l6-6-6-6" sw={2} size={14} />,
  User: () => (
    <Svg
      d={[
        "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
        "M12 3a4 4 0 100 8 4 4 0 000-8z",
      ]}
    />
  ),
  Print: () => (
    <Svg
      d={[
        "M6 9V2h12v7",
        "M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2",
        "M6 14h12v8H6z",
      ]}
    />
  ),
  Cash: () => (
    <Svg d={["M12 1v22", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} />
  ),
  Card: () => <Svg d={["M1 4h22v16H1z", "M1 10h22"]} />,
  Store: () => <Svg d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  Package: () => (
    <Svg
      d={["M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"]}
    />
  ),
  TrendUp: () => <Svg d={["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"]} />,
  TrendDown: () => <Svg d={["M23 18l-9.5-9.5-5 5L1 6", "M17 18h6v-6"]} />,
  Receipt: () => (
    <Svg
      d={[
        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z",
        "M14 2v6h6",
        "M9 13h6m-6 4h4",
      ]}
    />
  ),
  Filter: () => <Svg d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" />,
  Download: () => (
    <Svg
      d={[
        "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4",
        "M7 10l5 5 5-5",
        "M12 15V3",
      ]}
    />
  ),
  Eye: () => (
    <Svg
      d={[
        "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
        "M12 9a3 3 0 100 6 3 3 0 000-6z",
      ]}
    />
  ),
  Edit: () => (
    <Svg
      d={[
        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
        "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
      ]}
    />
  ),
  Alert: () => (
    <Svg
      d={[
        "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
        "M12 9v4m0 4h.01",
      ]}
    />
  ),
  Sofa: () => (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <rect x="2" y="9" width="20" height="8" rx="2" />
      <path d="M5 9V6a1 1 0 011-1h12a1 1 0 011 1v3M5 17v2m14-2v2" />
    </svg>
  ),
  Menu: () => <Svg d="M4 6h16M4 12h16M4 18h16" />,
  Star: () => (
    <Svg
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill
    />
  ),
  CalendarIcon: () => (
    <Svg
      d={[
        "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
      ]}
    />
  ),
  Transfer: () => (
    <Svg
      d={[
        "M3 12h18M3 12l4-4m-4 4l4 4M21 12l-4-4m4 4l-4 4",
        "M15 5h6v6M9 19H3v-6",
      ]}
    />
  ),
  RefreshCw: () => (
    <Svg
      d={[
        "M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16",
        "M3 16v5h5",
        "M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8",
        "M21 8V3h-5",
      ]}
    />
  ),

  FileText: () => (
    <Svg
      d={[
        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z",
        "M14 2v6h6",
        "M8 13h8",
        "M8 17h6",
      ]}
    />
  ),

  Mail: () => (
    <Svg
      d={[
        "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z",
        "M22 6l-10 7L2 6",
      ]}
    />
  ),

  Phone: () => (
    <Svg
      d={[
        "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.33 1.77.63 2.61a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.47-1.15a2 2 0 012.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0122 16.92z",
      ]}
    />
  ),

  MapPin: () => (
    <Svg
      d={[
        "M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1118 0z",
        "M12 7a3 3 0 100 6 3 3 0 000-6z",
      ]}
    />
  ),

  ShoppingCart: () => (
    <Svg
      d={[
        "M6 6h15l-1.5 9h-12z",
        "M6 6L5 2H2",
        "M8 21a1 1 0 100-2 1 1 0 000 2z",
        "M18 21a1 1 0 100-2 1 1 0 000 2z",
      ]}
    />
  ),

  Users: () => (
    <Svg
      d={[
        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
        "M9 7a4 4 0 100 8 4 4 0 000-8z",
        "M23 21v-2a4 4 0 00-3-3.87",
        "M16 3.13a4 4 0 010 7.75",
      ]}
    />
  ),
};
