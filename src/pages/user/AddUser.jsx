import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { T, card } from "../../theme/colors";
import { Btn } from "../../components/Button";
import { Ic } from "../../components/Icons";
import { useUserStore } from "../../store/userStore";
import { useBranchStore } from "../../store/branchStore";
import { useZoneStore } from "../../store/zoneStore";
import { useLanguageStore } from "../../store/languageStore";

const EMPTY = {
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
  role_id: "",
  store_id: "",
  zone_id: "",
  is_active: true,
};

export default function AddUser() {
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEdit = Boolean(userId);

  const ROLES = [
    { role_id: 1, role_name: t("admin"), icon: "🛡️", desc: t("fullSystemAccess") },
    {
      role_id: 2,
      role_name: t("manager"),
      icon: "📊",
      desc: t("manageStoresInZone"),
    },
    {
      role_id: 3,
      role_name: t("seller"),
      icon: "🛒",
      desc: t("salesCustomerHandling"),
    },
  ];

  const {
    currentUser,
    fetchUserById,
    createUser,
    updateUser,
    isLoading,
    isSubmitting,
    error,
    clearError,
  } = useUserStore();

  const { branches, fetchBranches } = useBranchStore();
  const { zones, fetchZones } = useZoneStore();

  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchBranches({ is_active: true });
    fetchZones();
    clearError?.();
  }, [fetchBranches, fetchZones, clearError]);

  useEffect(() => {
    if (isEdit) fetchUserById(userId);
  }, [isEdit, userId, fetchUserById]);

  useEffect(() => {
    if (isEdit && currentUser) {
      setForm({
        username: currentUser.username || "",
        password: "",
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        role_id: currentUser.role_id ? String(currentUser.role_id) : "",
        store_id: currentUser.store_id ? String(currentUser.store_id) : "",
        zone_id: currentUser.zone_id ? String(currentUser.zone_id) : "",
        is_active: Boolean(currentUser.is_active),
      });
    }
  }, [isEdit, currentUser]);

  const selectedRole = useMemo(
    () => ROLES.find((r) => Number(r.role_id) === Number(form.role_id)),
    [form.role_id, t]
  );

  const selectedStore = useMemo(
    () => branches.find((b) => Number(b.store_id) === Number(form.store_id)),
    [branches, form.store_id],
  );

  const setField = (key) => (e) => {
    const value = key === "is_active" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
    setFormError("");
  };

  const validate = () => {
    if (!form.username.trim()) return t("usernameRequired");
    if (form.username.trim().length < 3)
      return t("usernameMinChars");
    if (!isEdit && form.password.length < 6)
      return t("passwordMinChars");
    if (isEdit && form.password && form.password.length < 6)
      return t("passwordMinChars");
    if (!form.full_name.trim()) return t("fullNameRequired");
    if (!form.role_id) return t("roleRequired");

    if (Number(form.role_id) === 3 && !form.store_id) return t("storeRequiredForSeller");
    if (Number(form.role_id) === 2 && !form.zone_id) return t("zoneRequiredForManager");

    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setFormError(err);

    try {
      const payload = {
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        role_id: Number(form.role_id),
        store_id: form.store_id ? Number(form.store_id) : undefined,
        zone_id: form.zone_id ? Number(form.zone_id) : undefined,
        is_active: form.is_active,
      };

      if (form.password) payload.password = form.password;

      if (isEdit) {
        await updateUser(userId, payload);
      } else {
        await createUser(payload);
      }

      setSaved(true);
    } catch {}
  };

  if (saved) {
    return (
      <div style={{ minHeight: 460, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <h2 style={{ color: T.text, fontWeight: 900 }}>
            {t("user")} {isEdit ? t("updated") : t("created")}
          </h2>
          <p style={{ color: T.textSub }}>
            {form.full_name} {t("userSavedSuccessfully")}.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Btn variant="ghost" onClick={() => navigate("/users")}>
              {t("viewUsers")}
            </Btn>
            {!isEdit && (
              <Btn
                onClick={() => {
                  setForm(EMPTY);
                  setSaved(false);
                }}
              >
                <Ic.Plus /> {t("addAnother")}
              </Btn>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEdit && isLoading && !currentUser) {
    return (
      <div style={{ ...card(), padding: 30, color: T.textSub }}>
        {t("loadingUser")}...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            background: "linear-gradient(135deg,var(--accent),#7a3a06)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Ic.User />
        </div>
        <div>
          <h1 style={{ color: T.text, margin: 0, fontWeight: 900 }}>
            {isEdit ? t("editUser") : t("addUser")}
          </h1>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: 12 }}>
            {t("createSystemAccountRoleBranch")}
          </p>
        </div>

        <Btn
          variant="ghost"
          onClick={() => navigate("/users")}
          style={{ marginLeft: "auto" }}
        >
          <Ic.Close /> {t("cancel")}
        </Btn>
      </div>

      {(formError || error) && (
        <div
          style={{
            ...card(),
            padding: 12,
            color: T.red,
            borderLeft: `4px solid ${T.red}`,
            fontWeight: 800,
          }}
        >
          {formError || error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr .75fr",
          gap: 16,
        }}
      >
        <div style={{ ...card(), padding: 22 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <Field label={t("fullName") + " *"}>
              <input
                value={form.full_name}
                onChange={setField("full_name")}
                style={inputStyle()}
              />
            </Field>

            <Field label={t("username") + " *"}>
              <input
                value={form.username}
                onChange={setField("username")}
                style={inputStyle()}
              />
            </Field>

            <Field label={isEdit ? t("newPassword") : t("password") + " *"}>
              <input
                type="password"
                value={form.password}
                onChange={setField("password")}
                placeholder={
                  isEdit ? t("keepBlankToAvoidChange") : t("passwordMinChars")
                }
                style={inputStyle()}
              />
            </Field>

            <Field label={t("phone")}>
              <input
                value={form.phone}
                onChange={setField("phone")}
                style={inputStyle()}
              />
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label={t("email")}>
              <input
                type="email"
                value={form.email}
                onChange={setField("email")}
                style={inputStyle()}
              />
            </Field>
          </div>

          <div style={{ marginTop: 18 }}>
            <Field label={t("selectRole") + " *"}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                }}
              >
                {ROLES.map((role) => {
                  const active = Number(form.role_id) === Number(role.role_id);
                  return (
                    <button
                      key={role.role_id}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          role_id: String(role.role_id),
                        }))
                      }
                      style={{
                        ...card(),
                        padding: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        border: active
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        background: active
                          ? "var(--accent-light)"
                          : "var(--surface)",
                      }}
                    >
                      <div style={{ fontSize: 24 }}>{role.icon}</div>
                      <b style={{ color: T.text, textTransform: "capitalize" }}>
                        {role.role_name}
                      </b>
                      <p
                        style={{
                          color: T.textSub,
                          fontSize: 11,
                          margin: "5px 0 0",
                        }}
                      >
                        {role.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {(Number(form.role_id) === 3 || Number(form.role_id) === 1) && (
            <div style={{ marginTop: 14 }}>
              <Field label={t("assignStoreRequiredSeller")}>
                <select
                  value={form.store_id}
                  onChange={setField("store_id")}
                  style={inputStyle()}
                >
                  <option value="">{t("selectStore")}</option>
                  {branches.map((b) => (
                    <option key={b.store_id} value={b.store_id}>
                      {b.store_name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {(Number(form.role_id) === 2 || Number(form.role_id) === 1) && (
            <div style={{ marginTop: 14 }}>
              <Field label={t("assignZoneRequiredManager")}>
                <select
                  value={form.zone_id}
                  onChange={setField("zone_id")}
                  style={inputStyle()}
                >
                  <option value="">{t("selectZone")}</option>
                  {zones.map((z) => (
                    <option key={z.zone_id} value={z.zone_id}>
                      {z.zone_name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {isEdit && (
            <label
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 10,
                color: T.textSub,
              }}
            >
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={setField("is_active")}
              />
              {t("activeAccount")}
            </label>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 22,
            }}
          >
            <Btn variant="ghost" onClick={() => navigate("/users")}>
              {t("cancel")}
            </Btn>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                border: "none",
                borderRadius: 12,
                background: "var(--accent)",
                color: "#fff",
                padding: "12px 18px",
                fontWeight: 900,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting
                ? t("saving") + "..."
                : isEdit
                  ? t("saveChanges")
                  : t("createUser")}
            </button>
          </div>
        </div>

        <div style={{ ...card(), padding: 20, position: "sticky", top: 16 }}>
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              fontWeight: 900,
              margin: "0 0 12px",
            }}
          >
            {t("userPreview")}
          </p>

          <div
            style={{
              padding: 18,
              borderRadius: 18,
              border: "1px solid var(--border)",
              background:
                "linear-gradient(180deg,var(--surface),var(--surface-alt))",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                background: "linear-gradient(135deg,var(--accent),#7a3a06)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 28,
                fontWeight: 900,
                margin: "0 auto 12px",
              }}
            >
              {(form.full_name || form.username || "U").charAt(0).toUpperCase()}
            </div>

            <h3 style={{ color: T.text, margin: "0 0 4px", fontWeight: 900 }}>
              {form.full_name || t("fullName")}
            </h3>

            <p style={{ color: T.textMut, margin: 0, fontSize: 12 }}>
              @{form.username || t("username")}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <span style={pillStyle()}>
                {selectedRole?.role_name || t("noRole")}
              </span>
              <span style={pillStyle()}>
                {form.is_active ? t("active") : t("inactive")}
              </span>
            </div>

            <div
              style={{
                marginTop: 16,
                textAlign: "left",
                display: "grid",
                gap: 8,
              }}
            >
              <Info label={t("email")} value={form.email || "—"} />
              <Info label={t("phone")} value={form.phone || "—"} />
              <Info label={t("store")} value={selectedStore?.store_name || "—"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: T.textSub,
          fontSize: 11,
          fontWeight: 900,
          marginBottom: 6,
        }}
      >
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      <p style={{ color: T.textMut, margin: "0 0 3px", fontSize: 10 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ color: T.text, margin: 0, fontSize: 12, fontWeight: 800 }}>
        {value}
      </p>
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "var(--text-primary)",
    outline: "none",
  };
}

function pillStyle() {
  return {
    padding: "5px 10px",
    borderRadius: 999,
    background: "var(--accent-light)",
    color: "var(--accent)",
    border: "1px solid rgba(172,82,8,.25)",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
  };
}


