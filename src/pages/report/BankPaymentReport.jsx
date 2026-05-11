import { useEffect, useState } from "react";
import { card, T } from "../../theme/colors";
import { Ic } from "../../components/Icons";
import { useReportStore } from "../../store/reportStore";
import { Input } from "../../components/Input";
import { useLanguageStore } from "../../store/languageStore";

const money = (v) => `৳${Number(v || 0).toLocaleString()}`;

export default function BankPaymentReport() {
  const { t } = useLanguageStore();
  const { fetchReport, isLoading } = useReportStore();
  const [data, setData] = useState({ salePayments: [], purchasePayments: [], expensePayments: [], installmentPayments: [] });
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetchReport("payments/bank", { startDate: dateFrom, endDate: dateTo });
      setData(res || { salePayments: [], purchasePayments: [], expensePayments: [], installmentPayments: [] });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  const allPayments = [
    ...(data.salePayments?.map(p => ({ ...p, type: t("sale"), ref: p.sale?.invoice_number })) || []),
    ...(data.purchasePayments?.map(p => ({ ...p, type: t("purchase"), ref: p.purchase?.purchase_reference })) || []),
    ...(data.expensePayments?.map(p => ({ ...p, type: t("expense"), ref: p.expense?.expense_name })) || []),
    ...(data.installmentPayments?.map(p => ({ ...p, type: t("installment"), ref: p.installment?.sale?.invoice_number })) || []),
  ].sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: T.text, margin: 0 }}>{t("bankPaymentReport")}</h1>
          <p style={{ color: T.textSub, margin: "5px 0 0" }}>{t("transactionsBankTransfersCards")}</p>
        </div>
        <Btn onClick={() => window.print()} variant="ghost"><Ic.Print /> {t("printReport")}</Btn>
      </div>

      <div style={{ ...card(), padding: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <Input label={t("from")} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <Input label={t("to")} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <Btn onClick={loadData} variant="ghost"><Ic.RefreshCw /></Btn>
      </div>

      <div style={{ ...card(), overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: T.bg2 }}>
            <tr>
              {[t("date"), t("type"), t("reference"), t("accountInfo"), t("amount")].map(h => (
                <th key={h} style={{ padding: "12px 15px", textAlign: "left", color: T.textMut, fontSize: 11, fontWeight: 800 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("loading")}...</td></tr>
            ) : allPayments.length === 0 ? (
               <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: T.textSub }}>{t("noBankPaymentsFound")}</td></tr>
            ) : (
              allPayments.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "12px 15px", color: T.textSub, fontSize: 12 }}>{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 15px", color: T.text }}>{p.type}</td>
                  <td style={{ padding: "12px 15px", color: T.accent, fontWeight: 700 }}>{p.ref}</td>
                  <td style={{ padding: "12px 15px", color: T.textSub }}>{p.bank_name || p.payment_note || "-"}</td>
                  <td style={{ padding: "12px 15px", color: T.text, fontWeight: 700 }}>{money(p.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, style }) {
  const isGhost = variant === "ghost";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 10,
        border: isGhost ? `1px solid ${T.border}` : "none",
        background: isGhost ? T.bg3 : T.accent,
        color: isGhost ? T.text : "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style
      }}
    >
      {children}
    </button>
  );
}
