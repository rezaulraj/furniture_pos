import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, card } from "../../theme/colors";
import { Badge } from "../../components/Badge";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useUserStore } from "../../store/userStore";
import { useBranchStore } from "../../store/branchStore";

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
  const navigate = useNavigate();
  const {
    users,
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
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchBranches({ is_active: true });
    clearError?.();
  }, [fetchUsers, fetchBranches, clearError]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter((u) => {
      const matchesSearch =
        u.full_name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);

      const matchesRole = roleF === "all" || u.role?.role_name === roleF;

      const matchesStore =
        storeF === "all" || Number(u.store_id) === Number(storeF);

      const matchesStatus =
        statusF === "all" ||
        (statusF === "active" ? u.is_active : !u.is_active);

      return matchesSearch && matchesRole && matchesStore && matchesStatus;
    });
  }, [users, search, roleF, storeF, statusF]);

  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;
  const adminCount = users.filter((u) => u.role?.role_name === "admin").length;

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
            All Users
          </h1>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
            Manage admin, manager and seller accounts
          </p>
        </div>

        <Btn
          onClick={() => navigate("/users/add")}
          style={{ marginLeft: "auto" }}
        >
          <Ic.Plus /> Add User
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
          ["Total Users", users.length, T.accent, "👥"],
          ["Active", activeCount, T.green, "✅"],
          ["Inactive", inactiveCount, T.red, "🚫"],
          ["Admins", adminCount, T.blue, "🛡️"],
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
          placeholder="Search name, username, email, phone..."
          style={{ ...inputStyle(), flex: 1, minWidth: 260 }}
        />

        <select
          value={roleF}
          onChange={(e) => setRoleF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="seller">Seller</option>
        </select>

        <select
          value={storeF}
          onChange={(e) => setStoreF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Stores</option>
          {branches.map((b) => (
            <option key={b.store_id} value={b.store_id}>
              {b.store_name}
            </option>
          ))}
        </select>

        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          style={inputStyle()}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
          {["User", "Role", "Contact", "Store", "Status", "Action"].map((h) => (
            <b key={h} style={{ color: T.textMut, fontSize: 10 }}>
              {h.toUpperCase()}
            </b>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: 34, textAlign: "center", color: T.textSub }}>
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 44, textAlign: "center", color: T.textSub }}>
            <div style={{ fontSize: 46 }}>👥</div>
            No user found
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
                    background: "linear-gradient(135deg,var(--accent),#7a3a06)",
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
                {user.role?.role_name?.toUpperCase() || "NO ROLE"}
              </Badge>

              <div>
                <p style={{ color: T.textSub, margin: 0, fontSize: 12 }}>
                  {user.email || "No email"}
                </p>
                <p
                  style={{ color: T.textMut, margin: "3px 0 0", fontSize: 11 }}
                >
                  {user.phone || "No phone"}
                </p>
              </div>

              <div style={{ color: T.textSub, fontSize: 12 }}>
                {user.store?.store_name || "No Store"}
              </div>

              <Badge color={user.is_active ? "green" : "red"} small>
                {user.is_active ? "ACTIVE" : "INACTIVE"}
              </Badge>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate(`/users/edit/${user.users_id}`)}
                  style={iconBtn(T.blue)}
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
                >
                  <Ic.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
            <h3 style={{ color: T.text, marginBottom: 6 }}>Delete User?</h3>
            <p style={{ color: T.textSub }}>
              {deleteTarget.full_name} will be deleted. If user has
              sales/purchases, backend may block deletion.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
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
                {isDeleting ? "Deleting..." : "Delete"}
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
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  };
}
