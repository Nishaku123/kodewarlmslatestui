import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn.js";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "bg-gradient-to-r from-[#ffdb4d] via-[#ffc21b] to-[#f5a900] text-[#071d3c] shadow-[0_10px_30px_rgba(255,183,15,0.22)] hover:brightness-110 active:brightness-95",
  secondary:
    "border border-[#3a6ea8]/70 bg-ink-800/70 text-mist-200 hover:border-[#4b8cc9] hover:bg-ink-700 hover:text-white",
  ghost: "text-mist-300 hover:bg-ink-800/80 hover:text-white",
  danger: "bg-rose-500 text-white hover:bg-rose-400 active:bg-rose-600",
};

const lightVariantClasses = {
  primary:
    "bg-[#2563eb] text-white shadow-[0_6px_16px_rgba(37,99,235,0.2)] hover:bg-[#1d4ed8] active:bg-[#1e40af]",
  secondary:
    "border border-[#cbd7e5] bg-white text-[#243957] shadow-sm hover:border-[#9bb7da] hover:bg-[#f4f8fd]",
  ghost: "text-[#2f6fca] hover:bg-[#edf4fc] hover:text-[#1d4ed8]",
  danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
};

/**
 * Returns the Tailwind classes for a button. Use this when a React Router
 * <Link> needs to look like a button.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  light = false,
} = {}) {
  return cn(
    baseClasses,
    (light ? lightVariantClasses : variantClasses)[variant] ||
      (light ? lightVariantClasses : variantClasses).primary,
    sizeClasses[size] || sizeClasses.md,
    fullWidth && "w-full",
    className
  );
}

/**
 * The standard button for the whole application.
 * Every visual state (hover, disabled, loading) is handled here.
 */
export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  light = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const iconSize = iconSizes[size] || iconSizes.md;

  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className, light })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2
          size={iconSize}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : Icon ? (
        <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />
      ) : null}

      {children}

      {!loading && IconRight ? (
        <IconRight size={iconSize} strokeWidth={2} aria-hidden="true" />
      ) : null}
    </button>
  );
}
