import { Link } from "react-router-dom";
import { Award, Download } from "lucide-react";
import { Card, CardContent } from "./Card.jsx";
import Button, { buttonClasses } from "./Button.jsx";
import { cn } from "../../utils/cn.js";

export default function CertificateCard({ certificate, onDownload, onCopy, onVerify }) {
  const verifyPath = `/verify/${encodeURIComponent(certificate.code)}`;

  return (
    <Card light className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <div
        className="relative flex h-20 items-center justify-between overflow-hidden border-b border-[#e1e9f2] bg-[#f3f7fd] px-5"
      >
        <span
          className="absolute inset-y-0 left-0 w-1 bg-[#2f80ed]"
          aria-hidden="true"
        />
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cbdcf1] bg-white text-[#2563eb]">
            <Award size={19} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#526782]">
              Kodewar LMS
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#0b1c3a]">
              Certificate of completion
            </p>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between p-4">
        <div className="flex min-w-0 gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 7l10 5 10-5" />
              <path d="M7 10l5 10h10l5-10" />
            </svg>
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center rounded-md border border-brand-500/25 bg-brand-500/10 px-2.5 py-1.5 text-[10px] font-medium text-brand-300">
                Certificate issued
              </span>
              <span className="text-[10px] text-[#64748b]">
                {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : "Pending"}
              </span>
            </div>

            <h2 className="mt-2 font-display text-lg font-semibold text-[#0b1c3a] line-clamp-1">
              {certificate.course.title}
            </h2>
            <p className="mt-1 text-xs text-[#526782]">
              {certificate.course.category} · {certificate.course.level}
              {certificate.course.durationMinutes
                ? ` · ${certificate.course.durationMinutes} minutes of content`
                : ""}
            </p>
            <p
              className="mt-3 line-clamp-1 inline-flex rounded-md bg-[#edf6ff] px-2.5 py-1.5 font-mono text-xs tracking-[0.08em] text-[#246fc2]"
            >
              {certificate.code}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            size="sm"
            icon={Download}
            light
            loading={false}
            onClick={onDownload}
          >
            {onDownload ? "Preparing" : "Download PDF"}
          </Button>
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              buttonClasses({ variant: "secondary", size: "sm", light: true }),
              "relative z-10"
            )}
          >
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M16 4h1a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1zm0 0h5a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-4zm-5 -5h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-14zm0 0V5a2 2 0 0 0 -2 -2H5a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h6" />
            </svg>
            {onCopy ? "Link copied" : "Copy link"}
          </button>
          <Link
            to={verifyPath}
            className={cn(
              buttonClasses({ variant: "ghost", size: "sm", light: true }),
              "relative z-10"
            )}
          >
            Verify
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 5v14M8 12l4 4 4-4" />
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}