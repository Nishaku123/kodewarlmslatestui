import { cn } from "../../utils/cn.js";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  light = false,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-[#3a6ea8]/50 bg-ink-900/40 px-6 py-10 text-center",
        light && "border-[#cbdcf1] bg-white/75 shadow-[0_8px_24px_rgba(15,42,80,0.08)]",
        className
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-300",
            light && "border-[#bad4fa] bg-[#eaf3ff] text-[#2475df]"
          )}
        >
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}

      <h3
        className={cn(
          "mt-4 font-display text-base font-medium text-white",
          light && "text-[#0b1c3a]"
        )}
      >
        {title}
      </h3>

      {description ? (
        <p
          className={cn(
            "mt-1.5 max-w-sm text-xs leading-5 text-mist-500",
            light && "text-[#60718a]"
          )}
        >
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
