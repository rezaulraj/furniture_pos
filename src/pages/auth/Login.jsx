import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold">Sign in</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Enter your username and password to access your dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--text-secondary)]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] px-4 pr-16 outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-light)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-light)]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-accent h-12 w-full rounded-2xl text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-4 text-center">
        {[
          ["Admin", "Full access"],
          ["Manager", "Operational control"],
          ["Seller", "Sales access"],
        ].map(([role, desc]) => (
          <div key={role}>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {role}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-[var(--accent)] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
