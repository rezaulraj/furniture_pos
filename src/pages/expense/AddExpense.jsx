import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useExpenseStore } from "../../store/expenseStore";
import { useBranchStore } from "../../store/branchStore";
import { useAuthStore } from "../../store/authStore";

export default function AddExpense() {
  const { createExpense, isSubmitting, error, clearError } = useExpenseStore();
  const { branches, fetchBranches } = useBranchStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    expense_title: "",
    expense_category_id: "",
    store_id: user?.store_id || "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    notes: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBranches();
    clearError?.();
  }, [fetchBranches, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense({
        ...form,
        expense_category_id: Number(form.expense_category_id),
        store_id: Number(form.store_id),
        amount: Number(form.amount),
      });
      setSuccess(true);
      setTimeout(() => (window.location.href = "/expenses"), 1500);
    } catch {}
  };

  if (success) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: T.green }}>Expense Added Successfully!</h2>
        <p>Redirecting to list...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ ...card(), padding: 24 }}>
        <h2 style={{ marginTop: 0, color: T.text }}>Add New Expense</h2>
        {error && <div style={{ color: T.red, marginBottom: 15 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <Field label="Expense Title *">
            <input
              required
              value={form.expense_title}
              onChange={(e) => setForm({ ...form, expense_title: e.target.value })}
              style={inputStyle()}
              placeholder="e.g. Office Rent, Electricity bill"
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Category *">
              <select
                required
                value={form.expense_category_id}
                onChange={(e) => setForm({ ...form, expense_category_id: e.target.value })}
                style={inputStyle()}
              >
                <option value="">Select Category</option>
                <option value="1">General</option>
                <option value="2">Utility</option>
                <option value="3">Rent</option>
                <option value="4">Salary</option>
              </select>
            </Field>

            <Field label="Store *">
              <select
                required
                value={form.store_id}
                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                style={inputStyle()}
              >
                <option value="">Select Store</option>
                {branches.map((b) => (
                  <option key={b.store_id} value={b.store_id}>{b.store_name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Amount *">
              <input
                required
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={inputStyle()}
              />
            </Field>

            <Field label="Date *">
              <input
                required
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                style={inputStyle()}
              />
            </Field>
          </div>

          <Field label="Payment Method">
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              style={inputStyle()}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
          </Field>

          <Field label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle()}
            />
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Btn type="button" variant="ghost" onClick={() => window.history.back()} style={{ flex: 1 }}>Cancel</Btn>
            <Btn type="submit" disabled={isSubmitting} style={{ flex: 2 }}>
              {isSubmitting ? "Saving..." : "Save Expense"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 800, color: T.textSub, marginBottom: 6, display: "block" }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    background: T.bg3,
    color: T.text,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };
}
