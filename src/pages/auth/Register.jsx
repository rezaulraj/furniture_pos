import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const roles = [
  { id: 1, label: "Admin", desc: "System owner & total control" },
  { id: 2, label: "Manager", desc: "Manage store operations" },
  { id: 3, label: "Seller", desc: "Sales and customer handling" },
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
    role_id: 3,
    store_id: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === Number(form.role_id)),
    [form.role_id],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "role_id" || name === "store_id" ? Number(value) : value,
    }));
    setError("");
  };

  const handleRoleSelect = (roleId) => {
    setForm((prev) => ({ ...prev, role_id: roleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await register(form);
      setSuccess(res?.message || "Registration successful");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold">Create account</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Register a new system user and assign a role beautifully.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="john_doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="******"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
              Store ID
            </label>
            <input
              type="number"
              name="store_id"
              value={form.store_id}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
              placeholder="1"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-[var(--text-secondary)]">
            Select Role
          </label>

          <div className="grid gap-3">
            {roles.map((role) => {
              const checked = Number(form.role_id) === role.id;
              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    checked
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-[var(--border)] bg-[var(--bg-base)] hover:border-[var(--accent)]/60"
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                      checked
                        ? "border-[var(--accent)] bg-[var(--accent)]"
                        : "border-[var(--text-muted)]"
                    }`}
                  >
                    {checked && <div className="h-2 w-2 rounded-sm bg-white" />}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {role.label}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {role.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Current role
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--accent)]">
              {selectedRole?.label}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {selectedRole?.desc}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-accent h-12 w-full rounded-2xl text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-[var(--accent)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
