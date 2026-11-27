import { cn } from "../../utils/cn.js";

const tones = {
  neutral: "border-ink-600 bg-ink-800/70 text-mist-300",
  brand: "border-brand-500/25 bg-brand-500/10 text-brand-300",
  success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  danger: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  info: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
};

const dotTones = {
  neutral: "bg-mist-400",
  brand: "bg-brand-400",
  success: "bg-emerald-400",
  warning: "bg-amber-300",
  danger: "bg-rose-400",
  info: "bg-cyan-400",
};

export default function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  light = false,
}) {
  const lightTones = {
    neutral: "border-[#d5dfeb] bg-[#f3f7fc] text-[#526782]",
    brand: "border-[#c5ddf7] bg-[#edf6ff] text-[#246fc2]",
    success: "border-[#b9e5c7] bg-[#eaf8ef] text-[#168044]",
    warning: "border-[#f2d59b] bg-[#fff7e8] text-[#a56600]",
    danger: "border-[#f2c2c7] bg-[#fff0f1] text-[#b42332]",
    info: "border-[#c5ddf7] bg-[#edf6ff] text-[#246fc2]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        (light ? lightTones : tones)[tone] ||
          (light ? lightTones : tones).neutral,
        className
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotTones[tone] || dotTones.neutral
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
