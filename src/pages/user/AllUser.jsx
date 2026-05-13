import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useUserStore } from "../../store/userStore";
import { useBranchStore } from "../../store/branchStore";
import { useLanguageStore } from "../../store/languageStore";
import { Pagination } from "../../components/Pagination";

const roleColor = (role) =>
  role === "admin" ? "red" : role === "manager" ? "blue" : "green";

const inputStyle = () => ({
  width: "100%",
  boxSizing: "border-box",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: "11px 12px",
  color: "var(--text-primary)",
  outline: "none",
});

export default function AllUser() {
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const {
    users,
    pagination,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    fetchUsers,
    toggleUserStatus,
    deleteUser,
    clearError,
  } = useUserStore();

  const { branches, fetchBranches } = useBranchStore();

  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [storeF, setStoreF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (roleF !== "all") params.role_id = roleF;
    if (storeF !== "all") params.store_id = storeF;
    if (statusF !== "all") params.is_active = statusF === "active";
    fetchUsers(params);
    clearError?.();
  }, [page, roleF, storeF, statusF]);

  useEffect(() => {
    fetchBranches({ is_active: true });
  }, []);

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  // Client-side search filter on current page data
  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      u.full_name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;
  const adminCount = users.filter((u) => u.role?.role_name === "admin").length;
  const totalUsers = pagination?.total ?? users.length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.users_id);
      setDeleteTarget(null);
    } catch {}
  };

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
            boxShadow: "0 14px 30px rgba(172,82,8,.28)",
          }}
        >
          <Ic.User />
        </div>

        <div>
          <h1 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            {t("allUsers")}
          </h1>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
            {t("manageAdminManagerSellerAccounts")}
          </p>
        </div>

        <Btn
          onClick={() => navigate("/users/add")}
          style={{ marginLeft: "auto" }}
        >
          <Ic.Plus /> {t("addUser")}
        </Btn>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {[
          [t("totalUsers"), totalUsers, T.accent, "👥"],
          [t("active"), activeCount, T.green, "✅"],
          [t("inactive"), inactiveCount, T.red, "🚫"],
          [t("admins"), adminCount, T.blue, "🛡️"],
        ].map(([label, value, color, icon]) => (
          <div
            key={label}
            style={{ ...card(), padding: 16, borderLeft: `4px solid ${color}` }}
          >
            <p
              style={{
                color: T.textSub,
                margin: 0,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              {label.toUpperCase()}
            </p>
            <p
              style={{
                color,
                margin: "6px 0 0",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {icon} {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          ...card(),
          padding: 14,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchNameUsernameEmailPhone")}
          style={{ ...inputStyle(), flex: 1, minWidth: 260 }}
        />

        <select
          value={roleF}
          onChange={(e) => handleFilterChange(setRoleF)(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allRoles")}</option>
          <option value="admin">{t("admin")}</option>
          <option value="manager">{t("manager")}</option>
          <option value="seller">{t("seller")}</option>
        </select>

        <select
          value={storeF}
          onChange={(e) => handleFilterChange(setStoreF)(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allStores")}</option>
          {branches.map((b) => (
            <option key={b.store_id} value={b.store_id}>
              {b.store_name}
            </option>
          ))}
        </select>
        <select
          value={statusF}
          onChange={(e) => handleFilterChange(setStatusF)(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">{t("allStatus")}</option>
          <option value="active">{t("active")}</option>
          <option value="inactive">{t("inactive")}</option>
        </select>

        <div
          style={{
            display: "flex",
            gap: 4,
            background: T.bg3,
            padding: 4,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            marginLeft: "auto",
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            style={viewBtnStyle(viewMode === "grid")}
          >
            <Ic.LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={viewBtnStyle(viewMode === "table")}
          >
            <Ic.List size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
            fontWeight: 800,
          }}
        >
          {error}
        </div>
      )}

      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 14,
          }}
        >
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ ...card(), minHeight: 220, opacity: 0.6 }} />
            ))
          ) : filtered.length === 0 ? (
            <div
              style={{
                ...card(),
                padding: 40,
                gridColumn: "1/-1",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48 }}>👥</div>
              <p style={{ color: T.textSub, fontWeight: 700 }}>{t("noUserFound")}</p>
            </div>
          ) : (
            filtered.map((user) => (
              <div
                key={user.users_id}
                style={{
                  ...card(),
                  padding: 18,
                  borderTop: `3px solid ${
                    user.is_active ? roleColor(user.role?.role_name) : T.textMut
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: "linear-gradient(135deg,var(--accent),#7a3a06)",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                        fontSize: 18,
                      }}
                    >
                      {(user.full_name || user.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p style={{ color: T.text, margin: 0, fontWeight: 900 }}>
                        {user.full_name}
                      </p>
                      <p style={{ color: T.textMut, margin: "2px 0 0", fontSize: 11 }}>
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <Badge color={user.is_active ? "green" : "red"} small>
                    {user.is_active ? t("active") : t("inactive")}
                  </Badge>
                </div>

                <div
                  style={{
                    margin: "16px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textMut, fontSize: 11 }}>{t("role")}</span>
                    <Badge color={roleColor(user.role?.role_name)} small>
                      {t(user.role?.role_name || "noRole")}
                    </Badge>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textMut, fontSize: 11 }}>{t("phone")}</span>
                    <span style={{ color: T.textSub, fontSize: 11, fontWeight: 700 }}>
                      {user.phone || "—"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.textMut, fontSize: 11 }}>{t("store")}</span>
                    <span style={{ color: T.textSub, fontSize: 11, fontWeight: 700 }}>
                      {user.store?.store_name || "—"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 14,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <button
                    onClick={() => navigate(`/users/edit/${user.users_id}`)}
                    style={{ ...iconBtn(T.blue), flex: 1, height: 34 }}
                  >
                    <Ic.Edit size={16} /> {t("edit")}
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => toggleUserStatus(user.users_id)}
                    style={{
                      ...iconBtn(user.is_active ? T.yellow : T.green),
                      flex: 1,
                      height: 34,
                    }}
                  >
                    {user.is_active ? "⏸" : <Ic.Check size={16} />}
                    {user.is_active ? t("suspend") : t("activate")}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    style={iconBtn(T.red, "rgba(248,113,113,.1)")}
                  >
                    <Ic.Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === "table" && (
        <div style={{ ...card(), overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1.5fr 1.8fr 1fr 1.4fr",
              gap: 12,
              padding: "14px 16px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {[
              t("user"),
              t("role"),
              t("contact"),
              t("store"),
              t("status"),
              t("action"),
            ].map((h) => (
              <b key={h} style={{ color: T.textMut, fontSize: 10 }}>
                {h.toUpperCase()}
              </b>
            ))}
          </div>

          {isLoading ? (
            <div style={{ padding: 34, textAlign: "center", color: T.textSub }}>
              {t("loadingUsers")}...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 44, textAlign: "center", color: T.textSub }}>
              <div style={{ fontSize: 46 }}>👥</div>
              {t("noUserFound")}
            </div>
          ) : (
            filtered.map((user) => (
              <div
                key={user.users_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1.5fr 1.8fr 1fr 1.4fr",
                  gap: 12,
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg,var(--accent),#7a3a06)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 900,
                    }}
                  >
                    {(user.full_name || user.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p style={{ color: T.text, margin: 0, fontWeight: 900 }}>
                      {user.full_name}
                    </p>
                    <p
                      style={{
                        color: T.textMut,
                        margin: "3px 0 0",
                        fontSize: 11,
                      }}
                    >
                      @{user.username}
                    </p>
                  </div>
                </div>

                <Badge color={roleColor(user.role?.role_name)} small>
                  {t(user.role?.role_name || "noRole").toUpperCase()}
                </Badge>

                <div>
                  <p style={{ color: T.textSub, margin: 0, fontSize: 12 }}>
                    {user.email || t("noEmail")}
                  </p>
                  <p
                    style={{ color: T.textMut, margin: "3px 0 0", fontSize: 11 }}
                  >
                    {user.phone || t("noPhone")}
                  </p>
                </div>

                <div style={{ color: T.textSub, fontSize: 12 }}>
                  {user.store?.store_name || t("noStore")}
                </div>

                <Badge color={user.is_active ? "green" : "red"} small>
                  {user.is_active
                    ? t("active").toUpperCase()
                    : t("inactive").toUpperCase()}
                </Badge>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigate(`/users/edit/${user.users_id}`)}
                    style={iconBtn(T.blue)}
                    title={t("edit")}
                  >
                    <Ic.Edit />
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => toggleUserStatus(user.users_id)}
                    style={iconBtn(user.is_active ? T.yellow : T.green)}
                  >
                    {user.is_active ? "⏸" : <Ic.Check />}
                  </button>

                  <button
                    onClick={() => setDeleteTarget(user)}
                    style={iconBtn(T.red, "rgba(248,113,113,.1)")}
                    title={t("delete")}
                  >
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Pagination meta={pagination} onPageChange={(p) => setPage(p)} />

      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.75)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{ ...card(), width: 420, padding: 24, textAlign: "center" }}
          >
            <div style={{ fontSize: 48 }}>🗑️</div>
            <h3 style={{ color: T.text, marginBottom: 6 }}>{t("deleteUserConfirmTitle")}</h3>
            <p style={{ color: T.textSub }}>
              {deleteTarget.full_name} {t("deleteUserConfirmDesc")}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                {t("cancel")}
              </Btn>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 12,
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {isDeleting ? t("deleting") + "..." : t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function iconBtn(color, bg = "rgba(96,165,250,.1)") {
  return {
    width: 32,
    height: 32,
    borderRadius: 9,
    border: "1px solid var(--border)",
    background: bg,
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    fontWeight: 900,
    fontSize: 11,
    transition: "all .2s",
  };
}

function viewBtnStyle(active) {
  return {
    width: 36,
    height: 36,
    borderRadius: 9,
    border: "none",
    background: active ? T.accent : "transparent",
    color: active ? "#fff" : T.textMut,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    transition: "all .2s",
  };
}


