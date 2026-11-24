import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CircleCheck,
  Layers,
  Lock,
  Send,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getNavigation } from "../../config/navigation.js";
import { getAssignmentsRequest } from "../../services/assignments.js";
import { formatDate } from "../../utils/roles.js";
import { cn } from "../../utils/cn.js";

function statusFor(assignment) {
  if (!assignment.isUnlocked) {
    return { label: "Locked", tone: "locked", icon: Lock };
  }

  if (assignment.submission?.status === "graded") {
    return { label: "Graded", tone: "graded", icon: CheckCircle2 };
  }

  if (assignment.submission) {
    return { label: "Submitted", tone: "submitted", icon: Send };
  }

  return { label: "Available", tone: "available", icon: ClipboardList };
}

function initials(title) {
  return String(title || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Keep the "JS" tile treatment from the workspace reference for the common
 * course stacks and fall back to real initials.
 */
function courseCode(title) {
  const value = String(title || "").toLowerCase();
  const stacks = [
    ["js", "javascript"],
    ["py", "python"],
    ["ts", "typescript"],
    ["r", "r programming"],
    ["sql", "sql"],
  ];

  const match = stacks.find(([, keyword]) => value.includes(keyword));
  if (match) return match[0].toUpperCase();

  return initials(title) || "KC";
}

const statusStyles = {
  submitted: {
    badge: "border-[#bfe9cd] bg-[#eaf9f0] text-[#15803d]",
    dot: "bg-[#22c55e]",
  },
  graded: {
    badge: "border-[#cfe4ff] bg-[#eaf3ff] text-[#1f6fd6]",
    dot: "bg-[#2f80ed]",
  },
  available: {
    badge: "border-[#cfe4ff] bg-[#eaf3ff] text-[#1f6fd6]",
    dot: "bg-[#2f80ed]",
  },
  locked: {
    badge: "border-[#e4ecf7] bg-[#f6f9fd] text-[#7b8da6]",
    dot: "bg-[#94a3b8]",
  },
};

function StatusBadge({ status }) {
  const style = statusStyles[status.tone] || statusStyles.locked;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        style.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden="true" />
      {status.label}
    </span>
  );
}

function AssignmentStatCard({ title, count, description, icon: Icon }) {
  return (
    <article className="relative isolate flex h-[128px] w-full flex-col justify-between overflow-hidden rounded-[20px] border border-[#168bff]/80 bg-gradient-to-br from-[#0b4da0] via-[#07377f] to-[#031b50] px-4 py-3 shadow-[0_8px_24px_rgba(0,89,255,0.24)]">
      <svg
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-20 w-48 text-[#00aaff]"
        viewBox="0 0 200 96"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-8 108C42 105 83 105 118 96C152 86 178 65 208 12"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.32"
        />
        <path
          d="M-8 108C42 105 83 105 118 96C152 86 178 65 208 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 flex min-h-14 items-center gap-3">
        <span
          className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[10px] border-2 border-[#ffbf00] bg-gradient-to-br from-[#25364e] to-[#0b1c37] text-[#ffbf00]"
        >
          <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base !font-semibold leading-5 text-white">{title}</p>
          <p className="mt-0.5 font-display text-[36px] !font-bold leading-9 tracking-tight text-white">
            {count}
          </p>
        </div>
      </div>

      <p className="relative z-10 min-h-4 truncate whitespace-nowrap pl-[47px] text-[13px] !font-normal leading-4 text-[#c7d7f0]">
        {description}
      </p>
    </article>
  );
}

function AssignmentRow({ assignment }) {
  const status = statusFor(assignment);
  const StatusIcon = status.icon;
  const weekLabel = `Week ${assignment.weekNumber} – ${assignment.moduleTitle}`;

  return (
    <div className="rounded-lg border border-[#e9f0f9] bg-white/85 p-2.5 transition-colors hover:border-[#cfe4ff] sm:p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="hidden h-4 w-px bg-[#e4ecf7] sm:block" aria-hidden="true" />
            <span className="text-xs font-medium text-[#7b8da6] sm:text-sm">{weekLabel}</span>
            {assignment.isPastDue && !assignment.submission ? (
              <span className="rounded-full border border-[#ffd6d6] bg-[#fff1f1] px-2 py-0.5 text-xs font-semibold text-[#d14343]">
                Past due
              </span>
            ) : null}
            {assignment.isLate ? (
              <span className="rounded-full border border-[#ffe2ab] bg-[#fff4e0] px-2 py-0.5 text-xs font-semibold text-[#b26a00]">
                Submitted late
              </span>
            ) : null}
          </div>

          <h3 className="mt-1.5 font-display text-base font-bold text-[#0b1c3a] sm:text-lg">
            {assignment.title}
          </h3>
          <p className="mt-1 line-clamp-2 max-w-3xl text-[13px] leading-5 !font-medium text-[#5d718c]">
            {assignment.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-[#5d718c] sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Layers size={15} className="text-[#7b8da6]" aria-hidden="true" />
              {assignment.maxPoints} points
            </span>
            <span className="hidden h-4 w-px bg-[#e4ecf7] sm:block" aria-hidden="true" />
            {assignment.dueAt ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} className="text-[#7b8da6]" aria-hidden="true" />
                Due {formatDate(assignment.dueAt)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} className="text-[#7b8da6]" aria-hidden="true" />
                No due date
              </span>
            )}
            {assignment.submission?.status === "graded" ? (
              <span className="font-medium text-[#1f6fd6]">
                Score {assignment.submission.score} of {assignment.maxPoints}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 sm:pt-1">
          {assignment.isUnlocked ? (
            <Link
              to={`/student/assignments/${assignment.id}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ffd34d] via-[#ffc21b] to-[#f5a900] px-4 py-2 text-sm font-semibold text-[#071d3c] shadow-[0_8px_18px_rgba(255,183,15,0.22)] transition hover:brightness-105 sm:w-auto"
            >
              {assignment.submission ? "View submission" : "Open assignment"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e4ecf7] bg-[#f6f9fd] px-3 py-2 text-xs font-medium text-[#7b8da6] sm:w-auto">
              <StatusIcon size={14} aria-hidden="true" />
              Locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AssignmentsHero() {
  return (
    <section className="relative h-[220px] overflow-hidden px-1 pt-5 sm:px-0 sm:pt-6">
      <img
        src="/assignment-hero.png"
        alt="Laptop showing a completed assignment checklist beside a stack of books on a glowing rock"
        className="pointer-events-none absolute bottom-0 left-3/4 hidden w-[40%] max-w-[320px] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_34px_rgba(15,42,80,0.16)] md:block"
      />

      <div className="relative z-10 max-w-[560px] md:max-w-[50%]">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#0b1c3a]">
          <span className="h-[3px] w-9 rounded-full bg-[#ffb020]" aria-hidden="true" />
          Student workspace
        </p>

        <h1 className="mt-3 font-display text-[36px] font-bold leading-[1.02] tracking-tight text-[#0b1c3a] sm:text-[44px]">
          Assign
          <span className="relative inline-block bg-gradient-to-r from-[#3b91f5] to-[#1668d6] bg-clip-text text-transparent">
            ments
            <svg
              className="absolute -bottom-1 left-0 h-3 w-full text-[#ffb020]"
              viewBox="0 0 210 12"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M3 9C55 3 130 2 206 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-4 max-w-[540px] text-[15px] leading-6 !font-medium text-[#4b5f79]">
          Practical tasks unlock after the lessons in their week.
          <br />
          Submit written work and an optional link.
        </p>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5" aria-label="Loading assignments">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[128px] animate-pulse rounded-[20px] bg-white/70" />
        ))}
      </div>
      <div className="h-[260px] animate-pulse rounded-2xl bg-white/70" />
    </div>
  );
}

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAssignmentsRequest()
      .then((response) => {
        if (!active) return;
        setAssignments(response.data.assignments);
        setSummary(response.data.summary);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Could not load assignments.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(() => {
    if (!assignments) return [];

    const map = new Map();

    for (const assignment of assignments) {
      if (!map.has(assignment.courseId)) {
        map.set(assignment.courseId, {
          courseId: assignment.courseId,
          courseTitle: assignment.courseTitle,
          items: [],
        });
      }
      map.get(assignment.courseId).items.push(assignment);
    }

    return [...map.values()];
  }, [assignments]);

  const pendingCount = useMemo(
    () =>
      assignments?.filter(
        (assignment) => assignment.isUnlocked && !assignment.submission
      ).length || 0,
    [assignments]
  );

  const assignmentTotal = summary?.total ?? assignments?.length ?? 0;

  const summaryCards = (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AssignmentStatCard
        icon={ClipboardList}
        title="Assignments"
        count={assignmentTotal}
        description="Across your enrolled courses"
      />
      <AssignmentStatCard
        icon={Send}
        title="Submitted"
        count={summary?.submitted ?? 0}
        description="Including graded work"
      />
      <AssignmentStatCard
        icon={CircleCheck}
        title="Graded"
        count={summary?.graded ?? 0}
        description="Feedback has been left"
      />
      <AssignmentStatCard
        icon={Lock}
        title="Locked"
        count={summary?.locked ?? 0}
        description="Finish earlier lessons to unlock"
      />
    </div>
  );

  return (
    <DashboardLayout
      title="Assignments"
      subtitle="Your Kodewar learning workspace"
      navItems={getNavigation(user.role)}
      variant="light"
      showRole
      showHome
      notificationCount={pendingCount || summary?.submitted || 0}
      mainClassName="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-8 lg:px-[44px] lg:py-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[url('/login-background.png')] bg-cover bg-center bg-no-repeat contrast-125"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] space-y-5">
        <AssignmentsHero />

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-medium text-rose-700"
          >
            {error}
          </div>
        ) : null}

        {assignments === null ? (
          <LoadingState />
        ) : (
          <>
            {summaryCards}

            {assignments.length ? (
              <div id="assignment-list" className="space-y-4">
                {groups.map((group) => (
                  <section
                    key={group.courseId}
                    className="rounded-xl border border-white/80 bg-white/85 p-2.5 shadow-[0_8px_22px_rgba(15,42,80,0.06)] backdrop-blur-sm sm:p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffe27a] via-[#ffc21b] to-[#f0a300] font-display text-base font-extrabold tracking-tight text-[#5a3600] shadow-[0_6px_14px_rgba(240,163,0,0.24)]">
                          {courseCode(group.courseTitle)}
                        </span>
                        <div className="min-w-0">
                          <h2 className="truncate font-display text-lg font-bold text-[#0b1c3a]">
                            {group.courseTitle}
                          </h2>
                          <p className="mt-0.5 text-xs !font-semibold text-[#7b8da6]">
                            {group.items.length}{" "}
                            {group.items.length === 1 ? "assignment" : "assignments"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/student/courses/${group.courseId}`}
                        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#2f80ed] transition hover:text-[#1f6fd6]"
                      >
                        Open course
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((assignment) => (
                        <AssignmentRow key={assignment.id} assignment={assignment} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                light
                icon={ClipboardList}
                title="No assignments yet"
                description="Assignments appear here when a course you are enrolled in has a published task."
                action={
                  <Link
                    to="/student/courses"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2f80ed] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,128,237,0.24)] transition hover:bg-[#1f6fd6]"
                  >
                    Browse my courses
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                }
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
