import { useState } from "react";
import { card, T } from "../theme/colors";
import { Input, Select } from "./Input";
import { Btn } from "./Button";
import { Ic } from "./Icons";

export default function CustomerModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", type: "Retail", credit: "" });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const save = () => {
    if (!form.name || !form.phone) return;
    onSave({ ...form, id: Date.now(), code: `CUS-${String(Math.floor(Math.random() * 900) + 100)}` });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
      <div style={{ ...card(), width: 480, padding: "22px 24px", animation: "slideUp .25s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h3 style={{ color: T.text, fontWeight: 800, fontSize: 15, margin: 0 }}>New Customer</h3>
            <p style={{ color: T.textSub, fontSize: 11, margin: 0 }}>Add a new customer to the system</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub }}><Ic.Close /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ gridColumn: "1/-1" }}><Input label="Full Name *" value={form.name} onChange={set("name")} placeholder="Customer or business name" icon={<Ic.User />} /></div>
          <Input label="Phone *" value={form.phone} onChange={set("phone")} placeholder="+880-1XXX-XXXXXX" />
          <Input label="Email" value={form.email} onChange={set("email")} placeholder="email@example.com" type="email" />
          <Select label="Customer Type" value={form.type} onChange={set("type")} options={["Retail", "Wholesale", "VIP"]} />
          <Input label="Credit Limit (৳)" value={form.credit} onChange={set("credit")} placeholder="0" type="number" />
          <div style={{ gridColumn: "1/-1" }}><Input label="Address" value={form.address} onChange={set("address")} placeholder="Full address" /></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} disabled={!form.name || !form.phone}><Ic.Check /> Save Customer</Btn>
        </div>
      </div>
    </div>
  );
}