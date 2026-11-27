import StudentPageTitle from "./StudentPageTitle.jsx";

/**
 * Consistent page heading used inside the dashboard layout.
 * Shows an optional small eyebrow, a title, a description and actions.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  light = false,
  largeTitle = false,
  titleAccent,
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow || (light && actions) ? (
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            {eyebrow ? (
              <p
                className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  light ? "text-[#c27a00]" : "text-brand-300"
                }`}
              >
                <span
                  className={`h-px w-8 ${
                    light ? "bg-[#f5a623]" : "bg-brand-500"
                  }`}
                  aria-hidden="true"
                />
                {eyebrow}
              </p>
            ) : null}
            {light && actions ? (
              <div className="shrink-0">{actions}</div>
            ) : null}
          </div>
        ) : null}

        {largeTitle ? (
          <StudentPageTitle title={title} accent={titleAccent} className="mt-2" />
        ) : (
          <h1
            className={`mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
              light ? "text-[#0b1c3a]" : "text-white"
            }`}
          >
            {title}
          </h1>
        )}

        {description ? (
          <p
            className={`mt-2 text-sm leading-6 ${
              light ? "max-w-3xl text-[#526782]" : "max-w-2xl text-mist-400"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions && !light ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
