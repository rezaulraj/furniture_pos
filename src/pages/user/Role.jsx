import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Ic } from "../../components/Icons";
import { useLanguageStore } from "../../store/languageStore";

export default function Role() {
  const { t } = useLanguageStore();

  const roles = [
    {
      name: t("admin"),
      id: "admin",
      icon: "🛡️",
      color: T.red,
      desc: t("adminDesc"),
      permissions: [
        t("permCreateUpdateDeleteUsers"),
        t("permManageProductsBranchesSuppliers"),
        t("permApproveReturnsStockTransfer"),
        t("permViewSalesPurchasesReports"),
      ],
    },
    {
      name: t("manager"),
      id: "manager",
      icon: "📊",
      color: T.blue,
      desc: t("managerDesc"),
      permissions: [
        t("permCreateProductCategoryPurchase"),
        t("permManageInventoryStockTransfer"),
        t("permViewSalesPurchaseReports"),
        t("permCreateSupplierCustomer"),
      ],
    },
    {
      name: t("seller"),
      id: "seller",
      icon: "🛒",
      color: T.green,
      desc: t("sellerDesc"),
      permissions: [
        t("permCreateNewSales"),
        t("permViewCustomersSuppliers"),
        t("permCheckStockAlerts"),
        t("permViewSaleHistoryStore"),
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            background: "linear-gradient(135deg,var(--accent),#7a3a06)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
          }}
        >
          <Ic.User />
        </div>

        <div>
          <h1 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            {t("userRoles")}
          </h1>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
            {t("rolePermissionOverview")}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {roles.map((role) => (
          <div
            key={role.id}
            style={{
              ...card(),
              padding: 20,
              borderTop: `4px solid ${role.color}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 38 }}>{role.icon}</div>
              <Badge
                color={
                  role.id === "admin"
                    ? "red"
                    : role.id === "manager"
                      ? "blue"
                      : "green"
                }
              >
                {role.name.toUpperCase()}
              </Badge>
            </div>

            <h2
              style={{
                color: T.text,
                textTransform: "capitalize",
                margin: "16px 0 6px",
                fontWeight: 900,
              }}
            >
              {role.name}
            </h2>

            <p
              style={{
                color: T.textSub,
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: 0,
              }}
            >
              {role.desc}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 9,
                marginTop: 16,
              }}
            >
              {role.permissions.map((p) => (
                <div
                  key={p}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    padding: 10,
                    borderRadius: 12,
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ color: T.green }}>
                    <Ic.Check />
                  </span>
                  <span style={{ color: T.textSub, fontSize: 12 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card(), padding: 18 }}>
        <h3 style={{ color: T.text, marginTop: 0 }}>
          {t("backendRouteProtection")}
        </h3>
        <p style={{ color: T.textSub, fontSize: 13, lineHeight: 1.7 }}>
          {t("backendRouteProtectionDesc")}
        </p>
      </div>
    </div>
  );
}
