import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-[var(--border)] bg-[radial-gradient(circle_at_top_left,rgba(172,82,8,0.22),transparent_32%),linear-gradient(160deg,var(--bg-secondary),var(--bg-base))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent,rgba(34,197,94,0.04),transparent)]" />
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 backdrop-blur">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--green)] live-badge" />
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                Secure POS Authentication
              </span>
            </div>

            <h1 className="mt-8 max-w-xl text-4xl xl:text-5xl font-extrabold leading-tight">
              Smart access for your{" "}
              <span className="text-[var(--accent)]">store system</span>
            </h1>
            <p className="mt-5 max-w-lg text-base xl:text-lg text-[var(--text-secondary)] leading-8">
              Beautiful sign in and registration flow with protected routes,
              refresh tokens, Zustand state, and role-based access for admin,
              manager, and seller.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["JWT Access", "Fast protected API requests"],
              ["Refresh Token", "Seamless session renewal"],
              ["Role Access", "Admin • Manager • Seller"],
              ["Elegant UI", "Using your brand colors"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur"
              >
                <p className="text-sm font700 text-[var(--text-primary)]">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-7 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]"
            >
              Jihan<span className="text-[var(--accent)]">POS</span>
            </Link>
            <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              {location.pathname === "/login"
                ? "Welcome back"
                : "Create account"}
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
