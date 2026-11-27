import { Link } from "react-router-dom";
import { Bell, Home, Menu, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { roleLabel } from "../../utils/roles.js";
import Avatar from "../ui/Avatar.jsx";
import { cn } from "../../utils/cn.js";

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
  variant = "dark",
  searchValue,
  onSearchChange,
  notificationCount = 0,
  showHome = false,
  showRole = false,
}) {
  const { user } = useAuth();
  const student = user?.role === "student";
  const light = variant === "light";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 backdrop-blur",
        light
          ? "border-b border-[#e3ebf6] bg-white/90"
          : "border-b border-[#2f5f92]/40 bg-[#041427]/85 shadow-[0_1px_0_rgba(255,194,27,0.10)]"
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors lg:hidden",
            light
              ? "border-[#dfe8f4] text-[#4a6280] hover:bg-[#f1f6fc] hover:text-[#0b1c3a]"
              : "border-ink-700 text-mist-300 hover:bg-ink-800 hover:text-white"
          )}
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <div
          className={cn(
            "min-w-0 lg:w-[190px]",
            student ? "flex-1 lg:flex-none" : "shrink-0"
          )}
        >
          <p
            className={cn(
              "truncate text-base",
              light
                ? "student-page-title font-bold text-[#0b1c3a]"
                : "font-display font-semibold text-white"
            )}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              className={cn(
                "truncate text-[11px]",
                light ? "text-[#7b8da6]" : "text-mist-500"
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {onSearchChange ? (
          <div
            className={cn(
              "hidden w-full md:block",
              light               ? "ml-auto max-w-[224px]" : "mx-auto max-w-md"
            )}
          >
            <label className="relative block">
              <span className="sr-only">Search courses, lessons, or topics</span>
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9cb5]"
              />
              <input
                type="search"
                value={searchValue || ""}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search courses, lessons, or topics..."
                className={cn(
                  "h-10 w-full rounded-full border pl-10 pr-14 text-sm outline-none transition-colors",
                  light
                    ? "border-[#e3ebf6] bg-white text-[#0b1c3a] placeholder:text-[#94a3b8] focus:border-[#9cc8f7] focus:ring-2 focus:ring-[#248ff2]/10"
                    : "border-[#2f5f92]/60 bg-ink-900/70 text-white placeholder:text-mist-500 focus:border-[#45abff] focus:ring-2 focus:ring-[#248ff2]/20"
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] sm:flex",
                  light
                    ? "border-[#e3ebf6] bg-[#f8fafc] text-[#94a3b8]"
                    : "border-[#2f5f92]/60 bg-ink-950/50 text-mist-500"
                )}
              >
                <kbd className="font-sans">⌘</kbd>K
              </span>
            </label>
          </div>
        ) : (
          <div className={student ? "hidden lg:block lg:flex-1" : "flex-1"} />
        )}

        {user ? (
          <div
            className={cn(
              "flex shrink-0 items-center gap-2 sm:gap-3",
              light ? "" : "ml-auto"
            )}
          >
            {!student ? (
              <Link
                to="/student/assignments"
                aria-label={
                  notificationCount
                    ? `${notificationCount} assignments need attention`
                    : "Assignments"
                }
                className={cn(
                  "relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  light
                    ? "text-[#5d718c] hover:bg-[#f1f6fc] hover:text-[#0b1c3a]"
                    : "text-mist-300 hover:bg-ink-800 hover:text-white"
                )}
              >
                <Bell size={18} aria-hidden="true" />
                {notificationCount ? (
                  <span
                    className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff8a00] ring-2 ring-white"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            ) : null}

            <Link
              to="/account"
              className={cn(
                "inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors",
                light
                  ? showRole
                    ? "border border-[#b8cdea] bg-white/40 hover:bg-white/70"
                    : "hover:bg-[#f1f6fc]"
                  : "border border-[#3a6ea8]/50 bg-ink-900/70 hover:border-brand-500/50 hover:bg-ink-800"
              )}
              aria-label={`Open profile for ${user.fullName}`}
            >
              <Avatar
                name={user.fullName}
                size="sm"
                className={
                  light
                    ? "border-[#0d3260] bg-[#0b3f7a] bg-none text-white"
                    : undefined
                }
              />
              {!light || showRole ? (
                <span
                  className={cn(
                    "hidden text-[11px] font-medium sm:block",
                    light ? "text-[#253959]" : "text-mist-300"
                  )}
                >
                  {roleLabel(user.role)}
                </span>
              ) : null}
            </Link>

            {!light || showHome ? (
              <Link
                to="/"
                aria-label="Back to status page"
                title="Back to status page"
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  light
                    ? "border-[#b8cdea] text-[#253959] hover:bg-white/70"
                    : "border-ink-700 text-mist-300 hover:bg-ink-800 hover:text-white"
                )}
              >
                <Home size={17} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline-flex",
                light
                  ? "border-brand-500/30 bg-brand-500/10 text-brand-700"
                  : "border-brand-500/20 bg-brand-500/10 text-brand-300"
              )}
            >
              Preview
            </span>
            {!light ? (
              <Link
                to="/"
                aria-label="Back to status page"
                title="Back to status page"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-700 text-mist-300 transition-colors hover:bg-ink-800 hover:text-white"
              >
                <Home size={17} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}
