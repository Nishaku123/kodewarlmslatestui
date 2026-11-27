import { useId } from "react";
import { cn } from "../../utils/cn.js";

export default function Textarea({
  label,
  hint,
  error,
  id,
  rows = 4,
  className,
  light = false,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const describedBy =
    [hint ? `${textareaId}-hint` : null, error ? `${textareaId}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label
          htmlFor={textareaId}
          className={`mb-1.5 block text-xs font-medium ${
            light ? "text-[#334155]" : "text-mist-300"
          }`}
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={cn(
          light
            ? "w-full resize-y rounded-lg border border-[#cbd7e5] bg-white px-3 py-2.5 text-sm leading-6 text-[#0b1c3a] outline-none transition-colors duration-200 placeholder:text-[#94a3b8]"
            : "w-full resize-y rounded-lg border bg-[#0a2444]/80 px-3 py-2.5 text-sm leading-6 text-white outline-none transition-colors duration-200 placeholder:text-mist-500",
          "focus:border-[#45abff] focus:ring-2 focus:ring-[#248ff2]/20",
          error
            ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-500/20"
            : light
              ? "border-[#cbd7e5] hover:border-[#94a3b8]"
              : "border-ink-700 hover:border-ink-600"
        )}
        {...props}
      />

      {(hint && !error) || error ? (
        <div className="mt-1.5">
          {hint && !error ? (
            <p
              id={`${textareaId}-hint`}
              className={`text-xs ${light ? "text-[#526782]" : "text-mist-500"}`}
            >
              {hint}
            </p>
          ) : null}
          {error ? (
            <p
              id={`${textareaId}-error`}
              className="text-xs text-rose-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      ) : null}    </div>
  );
}
