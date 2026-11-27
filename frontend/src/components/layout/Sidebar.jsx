import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, LogOut, X } from "lucide-react";
import BrandLogo from "../ui/BrandLogo.jsx";
import Avatar from "../ui/Avatar.jsx";
import { cn } from "../../utils/cn.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { roleLabel } from "../../utils/roles.js";

/**
 * Shared sidebar content used by the desktop sidebar and the mobile drawer.
 */
export function SidebarContent({
  navItems = [],
  onNavigate,
  showClose = false,
  onClose,
  closeButtonRef,
}) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const studentMenu = user?.role === "student";
  const compactMenu =
    studentMenu || user?.role === "admin" || user?.role === "trainer";

  async function handleLogout() {
    setSigningOut(true);

    try {
      await logout();
      toast({ tone: "success", title: "Signed out" });
      onNavigate?.();
      navigate("/login", { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="relative z-10 flex h-full flex-col">
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          compactMenu ? "px-4" : "px-5",
          compactMenu ? "h-16" : "h-[88px]",
          compactMenu && "border-b border-[#2f5f92]/50"
        )}
      >
        <Link
          to="/"
          onClick={onNavigate}
          aria-label="Kodewar LMS home"
          className="rounded-md"
        >
          <BrandLogo compact={compactMenu} />
        </Link>

        {showClose ? (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-mist-400 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <X size={17} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        <p
          className={cn(
            "px-2 pb-2 font-semibold uppercase tracking-[0.18em] text-[#8ba7c7]",
            compactMenu ? "text-[8px]" : "text-[10px]"
          )}
        >
          Workspace
        </p>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center transition-colors duration-200",
                    compactMenu
                      ? "gap-2 rounded-lg px-2 py-1.5 text-xs font-medium"
                      : "gap-3 rounded-[10px] px-2.5 py-2.5 text-sm font-medium",
                    isActive
                      ? compactMenu
                        ? "border border-l-[3px] border-[#ffc21b] bg-white/[0.065] text-white shadow-[0_6px_18px_rgba(255,194,27,0.12)]"
                        : "border border-[#c9a646]/75 bg-white/[0.035] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "border border-transparent text-mist-300 hover:bg-ink-800/70 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center transition-colors",
                        compactMenu ? "h-6 w-6" : "h-7 w-7",
                        isActive ? "text-white" : "text-mist-400"
                      )}
                    >
                      <item.icon
                        size={compactMenu ? 16 : 18}
                        strokeWidth={1.85}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="ml-auto rounded-full border border-ink-700 bg-ink-800 px-1.5 py-0.5 text-[10px] font-medium text-mist-400">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={cn(
          "border-t border-[#2f5f92]/40 p-4",
          compactMenu && "border-t-0 p-3"
        )}
      >
        {user ? (
          <div
            className={cn(
              "rounded-xl border border-[#3a6ea8]/40 bg-ink-900/70 p-2",
              compactMenu &&
                "rounded-xl border-[#0789ec]/90 bg-[#03162d]/85 p-2"
            )}
          >
            <Link
              to="/account"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-ink-800/70",
                compactMenu && "gap-2"
              )}
            >
              <Avatar
                name={user.fullName}
                size="sm"
                className={cn(
                  "border-[#3a6ea8]/70 bg-[#0b3f7a] bg-none text-white",
                  compactMenu && "border-[#50637a]/60 bg-[#344559]"
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-xs font-semibold text-white",
                    compactMenu && "student-profile-name text-xs"
                  )}
                >
                  {user.fullName}
                </p>
                <p
                  className={cn(
                    "truncate text-[10px] text-mist-400",
                    compactMenu && "text-[9px]"
                  )}
                >
                  {roleLabel(user.role)}
                </p>
              </div>
              <ChevronRight
                size={compactMenu ? 16 : 15}
                className="shrink-0 text-mist-500"
                aria-hidden="true"
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              className={cn(
                "mt-0.5 inline-flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-[10px] font-medium text-mist-500 transition-colors hover:text-rose-200 disabled:opacity-50",
                compactMenu &&
                  "mt-2 gap-1.5 border-t border-[#2f5f92]/50 rounded-none pt-2 text-xs text-mist-100 hover:text-white"
              )}
            >
              <LogOut size={compactMenu ? 14 : 11} aria-hidden="true" />
              {signingOut ? "Leaving" : "Sign out"}
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#3a6ea8]/40 bg-ink-900/70 p-3.5">
            <p className="flex items-center gap-2 text-xs font-medium text-mist-200">
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              Design preview
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-mist-500">
              This page is a component gallery. Sign in to use the real
              workspace.
            </p>
            <Link
              to="/login"
              onClick={onNavigate}
              className="mt-3 inline-flex text-[11px] font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              Go to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({
  navItems,
  variant = "dark",
  student = false,
  admin = false,
  trainer = false,
}) {
  const light = variant === "light";

  return (
    <aside
      className={cn(
        "sidebar-scene fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-[#2f5f92]/40 backdrop-blur-sm lg:block",
        (student || admin || trainer) && "student-overview-sidebar",
        student || light || admin || trainer
          ? "w-[220px]"
          : "w-[264px]"
      )}
    >
      {!student && !admin && !trainer ? (
        <>
          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-80 rounded-full bg-[radial-gradient(circle,rgba(24,124,255,0.28),transparent_65%)] blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#041427]/75 via-transparent to-transparent"
            aria-hidden="true"
          />
        </>
      ) : null}
      <SidebarContent navItems={navItems} />
    </aside>
  );
}
