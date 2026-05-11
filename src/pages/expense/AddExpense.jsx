import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useExpenseStore } from "../../store/expenseStore";
import { useBranchStore } from "../../store/branchStore";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";

export default function AddExpense() {
  const { t } = useLanguageStore();
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
        <h2 style={{ color: T.green }}>{t("expenseAddedSuccessfully")}</h2>
        <p>{t("redirectingToList")}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ ...card(), padding: 24 }}>
        <h2 style={{ marginTop: 0, color: T.text }}>{t("addNewExpense")}</h2>
        {error && <div style={{ color: T.red, marginBottom: 15 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <Field label={`${t("expenseTitle")} *`}>
            <input
              required
              value={form.expense_title}
              onChange={(e) => setForm({ ...form, expense_title: e.target.value })}
              style={inputStyle()}
              placeholder="e.g. Office Rent, Electricity bill"
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={`${t("category")} *`}>
              <select
                required
                value={form.expense_category_id}
                onChange={(e) => setForm({ ...form, expense_category_id: e.target.value })}
                style={inputStyle()}
              >
                <option value="">{t("selectCategory")}</option>
                <option value="1">{t("general")}</option>
                <option value="2">{t("utility")}</option>
                <option value="3">{t("rent")}</option>
                <option value="4">{t("salary")}</option>
              </select>
            </Field>

            <Field label={`${t("store")} *`}>
              <select
                required
                value={form.store_id}
                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                style={inputStyle()}
              >
                <option value="">{t("selectStore")}</option>
                {branches.map((b) => (
                  <option key={b.store_id} value={b.store_id}>{b.store_name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={`${t("amount")} *`}>
              <input
                required
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={inputStyle()}
              />
            </Field>

            <Field label={`${t("date")} *`}>
              <input
                required
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                style={inputStyle()}
              />
            </Field>
          </div>

          <Field label={t("paymentMethod")}>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              style={inputStyle()}
            >
              <option value="cash">{t("cash")}</option>
              <option value="bank">{t("bank")}</option>
            </select>
          </Field>

          <Field label={t("notes")}>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle()}
            />
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Btn type="button" variant="ghost" onClick={() => window.history.back()} style={{ flex: 1 }}>{t("cancel")}</Btn>
            <Btn type="submit" disabled={isSubmitting} style={{ flex: 2 }}>
              {isSubmitting ? t("saving") : t("saveExpense")}
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
