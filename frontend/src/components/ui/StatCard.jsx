import { cn } from "../../utils/cn.js";

const tones = {
  brand: "border-brand-500/20 bg-brand-500/10 text-brand-300",
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-300/20 bg-amber-300/10 text-amber-200",
};

const lightTones = {
  brand: "border-blue-200 bg-blue-50 text-blue-600",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "brand",
  className,
  light = false,
  compact = false,
}) {
  const iconTone =
    (light ? lightTones : tones)[tone] || (light ? lightTones : tones).brand;

  if (compact) {
    return (
      <div
        className={cn(
          light
            ? "rounded-xl border border-[#d6e0ed] bg-white p-4 shadow-[0_8px_24px_rgba(15,42,80,0.07)]"
            : "app-panel rounded-xl p-4",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {Icon ? (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                iconTone
              )}
            >
              <Icon size={15} strokeWidth={1.85} aria-hidden="true" />
            </span>
          ) : null}
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-[11px] font-medium",
                light ? "text-[#526782]" : "text-mist-400"
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "font-display text-xl font-semibold leading-tight tracking-tight",
                light ? "text-[#0b1c3a]" : "text-white"
              )}
            >
              {value}
            </p>
          </div>
        </div>

        {hint ? (
          <p
            className={cn(
              "mt-2.5 truncate text-[11px]",
              light ? "text-[#526782]" : "text-mist-500"
            )}
            title={hint}
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        light
          ? "rounded-xl border border-[#d6e0ed] bg-white p-5 shadow-[0_8px_24px_rgba(15,42,80,0.07)]"
          : "app-panel rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-xs font-medium", light ? "text-[#526782]" : "text-mist-400")}>
          {label}
        </p>
        {Icon ? (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border",
              iconTone
            )}
          >
            <Icon size={15} strokeWidth={1.85} aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-3 font-display text-2xl font-semibold tracking-tight",
          light ? "text-[#0b1c3a]" : "text-white"
        )}
      >
        {value}
      </p>

      {hint ? (
        <p className={cn("mt-1 text-[11px]", light ? "text-[#526782]" : "text-mist-500")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
