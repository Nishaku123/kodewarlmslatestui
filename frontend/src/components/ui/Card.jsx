import { cn } from "../../utils/cn.js";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("app-panel rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-[#2f5f92]/45 px-5 py-4",
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="font-display text-base font-medium text-white">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-mist-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-[#2f5f92]/45 px-5 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
