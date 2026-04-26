import { useEffect, useState } from "react";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useBranchStore } from "../../store/branchStore";
import { useZoneStore } from "../../store/zoneStore";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { id: 1, label: "Store Info", icon: "🏪", desc: "Name and type" },
  { id: 2, label: "Location", icon: "📍", desc: "Address & contact" },
  { id: 3, label: "Review", icon: "✅", desc: "Confirm & save" },
];

const TYPE_OPTIONS = [
  { type: "Flagship", icon: "🏆", color: "#f5a623", desc: "Primary hub" },
  { type: "Branch", icon: "🏪", color: "#60a5fa", desc: "Standard branch" },
  { type: "Warehouse", icon: "🏭", color: "#4ade80", desc: "Storage center" },
];

const EMPTY = {
  store_name: "",
  store_type: "Branch",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  zone_id: "",
  is_active: true,
};

export default function AddStore() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const { createBranch, isSubmitting, error, clearError } = useBranchStore();
  const { zones, fetchZones } = useZoneStore();

  useEffect(() => {
    fetchZones();
    clearError?.();
  }, [fetchZones, clearError]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: null }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1 && !form.store_name.trim()) e.store_name = "Required";
    if (s === 2 && !form.phone.trim()) e.phone = "Required";
    if (s === 2 && !form.zone_id) e.zone_id = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    try {
      await createBranch({ ...form, zone_id: Number(form.zone_id) });
      setSaved(true);
      setTimeout(() => navigate("/stores"), 1500);
    } catch {}
  };

  const tc = TYPE_OPTIONS.find((t) => t.type === form.store_type) || TYPE_OPTIONS[1];

  if (saved) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 20 }}>
      <div style={{ fontSize: 60 }}>✅</div>
      <h2 style={{ color: T.text, margin: 0 }}>Store Created!</h2>
      <p style={{ color: T.textSub }}>Redirecting to list...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <div style={{ width: 50, height: 50, borderRadius: 15, background: tc.color, display: "grid", placeItems: "center", fontSize: 24, color: "#fff" }}>
          {tc.icon}
        </div>
        <div>
          <h1 style={{ color: T.text, margin: 0, fontSize: 22 }}>Add New Store</h1>
          <p style={{ color: T.textSub, margin: 0, fontSize: 12 }}>Register a new location</p>
        </div>
        <Btn variant="ghost" onClick={() => navigate("/stores")} style={{ marginLeft: "auto" }}>Cancel</Btn>
      </div>

      {/* Stepper */}
      <div style={{ ...card(), padding: "12px 20px", display: "flex", gap: 10, alignItems: "center" }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: step >= s.id ? tc.color : T.bg3,
                color: step >= s.id ? "#fff" : T.textMut, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800
              }}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: step >= s.id ? T.text : T.textMut }}>{s.label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.id ? tc.color : T.border, margin: "0 10px" }} />}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div style={{ ...card(), padding: 24, minHeight: 300 }}>
        {error && <div style={{ color: T.red, marginBottom: 15, fontWeight: 800 }}>{error}</div>}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Store Name *" error={errors.store_name}>
              <input value={form.store_name} onChange={set("store_name")} style={inputStyle(errors.store_name)} placeholder="e.g. Dhaka Main Branch" />
            </Field>
            <div>
              <label style={labelStyle()}>STORE TYPE</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 8 }}>
                {TYPE_OPTIONS.map(opt => (
                  <button key={opt.type} onClick={() => setVal("store_type", opt.type)} style={typeBtn(form.store_type === opt.type, opt.color)}>
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <span style={{ fontWeight: 700 }}>{opt.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Phone *" error={errors.phone}>
                <input value={form.phone} onChange={set("phone")} style={inputStyle(errors.phone)} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={set("email")} style={inputStyle()} />
              </Field>
            </div>
            <Field label="Zone *" error={errors.zone_id}>
              <select value={form.zone_id} onChange={set("zone_id")} style={inputStyle(errors.zone_id)}>
                <option value="">Select Zone</option>
                {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
              </select>
            </Field>
            <Field label="Full Address">
              <textarea value={form.address} onChange={set("address")} rows={2} style={inputStyle()} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="City">
                <input value={form.city} onChange={set("city")} style={inputStyle()} />
              </Field>
              <Field label="District">
                <input value={form.district} onChange={set("district")} style={inputStyle()} />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ marginTop: 0 }}>Review Details</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <ReviewRow label="Name" value={form.store_name} />
              <ReviewRow label="Type" value={form.store_type} />
              <ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Zone" value={zones.find(z => Number(z.zone_id) === Number(form.zone_id))?.zone_name} />
              <ReviewRow label="Address" value={`${form.address}, ${form.city}`} />
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Btn variant="ghost" onClick={prev} disabled={step === 1}>Previous</Btn>
        {step < 3 ? (
          <Btn onClick={next}>Next Step</Btn>
        ) : (
          <Btn onClick={submit} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create Store"}</Btn>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelStyle()}>{label} {error && <span style={{ color: T.red }}>({error})</span>}</label>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ color: T.textMut, fontSize: 12 }}>{label}</span>
      <span style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{value || "—"}</span>
    </div>
  );
}

function labelStyle() {
  return { fontSize: 10, fontWeight: 800, color: T.textSub, letterSpacing: "0.05em" };
}

function inputStyle(error) {
  return {
    width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${error ? T.red : T.border}`,
    background: T.bg3, color: T.text, outline: "none", boxSizing: "border-box"
  };
}

function typeBtn(active, color) {
  return {
    padding: "15px 10px", borderRadius: 12, border: `2px solid ${active ? color : T.border}`,
    background: active ? `${color}15` : T.bg3, color: active ? color : T.textSub,
    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all .2s"
  };
}
