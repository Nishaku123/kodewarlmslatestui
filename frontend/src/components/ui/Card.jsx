import { cn } from "../../utils/cn.js";

export function Card({ className, children, light = false, ...props }) {
  return (
    <div
      className={cn(
        light
          ? "rounded-xl border border-[#d6e0ed] bg-white shadow-[0_8px_24px_rgba(15,42,80,0.07)]"
          : "app-panel rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
  light = false,
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b px-5 py-4",
        light ? "border-[#e1e9f2]" : "border-[#2f5f92]/45",
        className
      )}
    >
      <div className="min-w-0">
        <h3
          className={cn(
            "font-display text-base font-medium",
            light ? "text-[#0b1c3a]" : "text-white"
          )}
        >
          {title}
        </h3>
        {description ? (
          <p
            className={cn(
              "mt-1 text-xs leading-5",
              light ? "text-[#526782]" : "text-mist-500"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children, light = false }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t px-5 py-4",
        light ? "border-[#e1e9f2]" : "border-[#2f5f92]/45",
        className
      )}
    >
      {children}
    </div>
  );
}
