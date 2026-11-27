import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "../../utils/cn.js";

const tones = {
  info: {
    wrapper: "border-cyan-400/20 bg-cyan-400/[0.06]",
    icon: "text-cyan-300",
    title: "text-cyan-100",
    body: "text-cyan-200/80",
    Icon: Info,
  },
  success: {
    wrapper: "border-emerald-400/20 bg-emerald-400/[0.06]",
    icon: "text-emerald-300",
    title: "text-emerald-100",
    body: "text-emerald-200/80",
    Icon: CheckCircle2,
  },
  warning: {
    wrapper: "border-amber-300/20 bg-amber-300/[0.06]",
    icon: "text-amber-300",
    title: "text-amber-100",
    body: "text-amber-200/80",
    Icon: AlertTriangle,
  },
  danger: {
    wrapper: "border-rose-400/20 bg-rose-400/[0.06]",
    icon: "text-rose-300",
    title: "text-rose-100",
    body: "text-rose-200/80",
    Icon: XCircle,
  },
};

const lightTones = {
  info: {
    wrapper: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-950",
    body: "text-blue-900",
    Icon: Info,
  },
  success: {
    wrapper: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-600",
    title: "text-emerald-950",
    body: "text-emerald-900",
    Icon: CheckCircle2,
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-950",
    body: "text-amber-900",
    Icon: AlertTriangle,
  },
  danger: {
    wrapper: "border-rose-200 bg-rose-50",
    icon: "text-rose-600",
    title: "text-rose-950",
    body: "text-rose-900",
    Icon: XCircle,
  },
};

export default function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
  className,
  light = false,
}) {
  const style = (light ? lightTones : tones)[tone] ||
    (light ? lightTones : tones).info;
  const Icon = style.Icon;

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3.5",
        style.wrapper,
        className
      )}
    >
      <Icon
        size={17}
        strokeWidth={1.9}
        className={cn("mt-0.5 shrink-0", style.icon)}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        {title ? (
          <p className={cn("text-sm font-medium", style.title)}>{title}</p>
        ) : null}
        {children ? (
          <div className={cn("text-xs leading-5", style.body, title && "mt-1")}>
            {children}
          </div>
        ) : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className={cn(
            "-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
            light ? "hover:bg-black/5" : "hover:bg-white/5",
            style.icon
          )}
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
