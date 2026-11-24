import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Layers,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getNavigation } from "../../config/navigation.js";
import { getMyCoursesRequest } from "../../services/courses.js";
import { getProgressRequest } from "../../services/progress.js";
import { getAssignmentsRequest } from "../../services/assignments.js";
import { getMyCertificatesRequest } from "../../services/certificates.js";
import { cn } from "../../utils/cn.js";

const PLACEHOLDER_COURSE = null;

function displayName(fullName) {
  const words = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "Learner";

  // "sk aareefa" is how the demo student is stored; show the meaningful name.
  const name = words.length > 1 && words[0].length <= 2 ? words.at(-1) : words[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
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
 * The reference design shows a "JS" tile for JavaScript Foundations. Keep that
 * treatment for the common course stacks and fall back to real initials.
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

function nextClassSummary(course, nextLesson) {
  const scheduledAt =
    nextLesson?.scheduledAt || nextLesson?.startsAt || course?.nextClassAt;
  const date = scheduledAt ? new Date(scheduledAt) : null;

  if (date && !Number.isNaN(date.getTime())) {
    const day = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const start = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const end = new Date(date.getTime() + 60 * 60 * 1000).toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "2-digit" }
    );

    return {
      label: "Next Class",
      detail: `${day} · ${start} – ${end}`,
    };
  }

  if (nextLesson) {
    return {
      label: "Next Lesson",
      detail: nextLesson.moduleTitle
        ? `${nextLesson.title} · ${nextLesson.moduleTitle}`
        : nextLesson.title,
    };
  }

  return {
    label: "Next Up",
    detail: course?.category
      ? `${course.category} · Self-paced`
      : "Start the first lesson whenever you are ready",
  };
}

function formatHours(minutes) {
  if (!minutes) return "0";
  const hours = minutes / 60;
  return hours < 10 ? hours.toFixed(1) : String(Math.round(hours));
}

function formatDue(dueAt) {
  if (!dueAt) return "No due date";
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return "No due date";
  return `Due ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function shortDayLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * The API does not expose per-day study activity yet, so this series keeps the
 * weekly shape from the design. Replace it with a real endpoint when available.
 */
function buildActivitySeries(progressPercent) {
  const base = [1.4, 2.3, 1.8, 2.5, 2.9, 3.5, 4.3];
  const factor = Math.max(0.3, Math.min(1.25, progressPercent / 70));
  return base.map((value) => Math.round(value * factor * 10) / 10);
}

function smoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middle = (previous.x + current.x) / 2;
    path += ` C ${middle} ${previous.y}, ${middle} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

function CourseBadge({ code }) {
  const gradientId = `course-badge-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-full w-full"
      role="img"
      aria-label={`${code} course`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe98a" />
          <stop offset="45%" stopColor="#ffd23f" />
          <stop offset="100%" stopColor="#efa400" />
        </linearGradient>
      </defs>

      <rect
        x="7"
        y="9"
        width="106"
        height="104"
        rx="23"
        fill="#8a5400"
        opacity="0.45"
      />
      <rect
        x="6"
        y="5"
        width="106"
        height="104"
        rx="23"
        fill={`url(#${gradientId})`}
        stroke="#fff4bd"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="13"
        width="90"
        height="88"
        rx="17"
        fill="none"
        stroke="#fffbe6"
        strokeOpacity="0.28"
      />

      <path
        d="M84 109 L112 81 L112 98 Q112 109 101 109 Z"
        fill="#c48600"
      />
      <path d="M84 109 L112 81 L112 88 L91 109 Z" fill="#a96c00" opacity="0.6" />

      <text
        x="58"
        y="78"
        textAnchor="middle"
        fontFamily="Space Grotesk, ui-sans-serif, sans-serif"
        fontSize="37"
        fontWeight="800"
        letterSpacing="-1.5"
        fill="#5a3600"
      >
        {code}
      </text>
      <text
        x="58"
        y="77"
        textAnchor="middle"
        fontFamily="Space Grotesk, ui-sans-serif, sans-serif"
        fontSize="37"
        fontWeight="800"
        letterSpacing="-1.5"
        fill="#7a4b00"
        opacity="0.35"
      >
        {code}
      </text>
    </svg>
  );
}

function ProgressDonut({ value }) {
  const gradientId = `student-ring-${useId().replace(/:/g, "")}`;
  const size = 168;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative mx-auto h-[168px] w-[168px]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f80ed" />
            <stop offset="55%" stopColor="#36a3ff" />
            <stop offset="100%" stopColor="#ffb020" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eef2f8"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[38px] font-bold leading-none text-[#0b1c3a]">
          {safeValue}%
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#94a3b8]">
          Overall
        </span>
      </div>
    </div>
  );
}

function ActivityChart({ progressPercent }) {
  const gradientId = `activity-${useId().replace(/:/g, "")}`;
  const values = buildActivitySeries(progressPercent);
  const width = 420;
  const height = 120;
  const padding = 8;
  const max = 6;
  const today = new Date();

  const days = values.map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (values.length - 1 - index));
    return date;
  });

  const points = values.map((value, index) => ({
    x: padding + (index * (width - padding * 2)) / (values.length - 1),
    y: height - padding - (value / max) * (height - padding * 2),
    value,
  }));

  const line = smoothPath(points);
  const area = `${line} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="mt-3 flex gap-3">
      <div className="flex h-[120px] flex-col justify-between py-1 text-[10px] text-[#94a3b8]">
        <span>6h</span>
        <span>4h</span>
        <span>2h</span>
        <span>0h</span>
      </div>

      <div className="min-w-0 flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[120px] w-full"
          role="img"
          aria-label="Learning activity over the last seven days"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f80ed" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2f80ed" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => {
            const y = padding + (line * (height - padding * 2)) / 3;
            return (
              <line
                key={line}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#eef3fa"
                strokeWidth="1"
              />
            );
          })}

          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke="#2f80ed"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {points.map((point) => (
            <circle
              key={point.x}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#ffffff"
              stroke="#2f80ed"
              strokeWidth="2"
            />
          ))}
        </svg>

        <div className="mt-2 flex justify-between text-[10px] text-[#94a3b8]">
          {days.map((day) => (
            <span key={day.toISOString()}>{shortDayLabel(day)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, value, label, to, accent }) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex min-h-[76px] items-center gap-3.5 rounded-2xl border border-[#e4ecf7] border-l-4 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,42,80,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,42,80,0.09)]",
        accent.border
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          accent.icon
        )}
      >
        <Icon size={24} strokeWidth={2.5} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[26px] font-bold leading-none text-[#0b1c3a]">
          {value}
        </span>
        <span className="mt-1 block truncate text-xs font-medium text-[#6f819a]">
          {label}
        </span>
      </span>

      <ArrowRight
        size={18}
        className="shrink-0 text-[#94a3b8] transition group-hover:translate-x-0.5 group-hover:text-[#2f80ed]"
        aria-hidden="true"
      />
    </Link>
  );
}

function LightSkeleton() {
  return (
    <div className="space-y-5" aria-label="Loading dashboard">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="h-[240px] animate-pulse rounded-2xl bg-white/70" />
        <div className="h-[240px] animate-pulse rounded-2xl bg-white/70" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[88px] animate-pulse rounded-2xl bg-white/70"
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      getMyCoursesRequest(),
      getProgressRequest(),
      getAssignmentsRequest(),
      getMyCertificatesRequest(),
    ]).then((results) => {
      if (!active) return;

      const [coursesResult, progressResult, assignmentsResult, certificatesResult] =
        results;

      if (coursesResult.status === "fulfilled") {
        setCourses(coursesResult.value.data.courses || []);
      }

      if (progressResult.status === "fulfilled") {
        setProgress(progressResult.value.data || null);
      }

      if (assignmentsResult.status === "fulfilled") {
        setAssignments(assignmentsResult.value.data.assignments || []);
      }

      if (certificatesResult.status === "fulfilled") {
        setCertificates(certificatesResult.value.data.certificates || []);
      }

      if (results.every((result) => result.status === "rejected")) {
        setLoadError("We could not load your workspace. Please refresh to try again.");
      } else if (coursesResult.status === "rejected") {
        setLoadError("Some of your learning data could not be loaded.");
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const progressByCourse = useMemo(() => {
    const map = new Map();
    for (const entry of progress?.courses || []) {
      map.set(entry.id, entry.progress);
    }
    return map;
  }, [progress]);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCourses = useMemo(() => {
    if (!normalizedQuery) return courses;
    return courses.filter((course) =>
      [course.title, course.description, course.category, course.level]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [courses, normalizedQuery]);

  const continueCourse = useMemo(() => {
    const pool = normalizedQuery ? visibleCourses : courses;
    if (!pool.length) return PLACEHOLDER_COURSE;

    const inProgress = pool.find(
      (course) =>
        Number(course.progressPercent) > 0 &&
        Number(course.progressPercent) < 100
    );

    return (
      inProgress ||
      pool.find((course) => Number(course.progressPercent) < 100) ||
      pool[0]
    );
  }, [courses, visibleCourses, normalizedQuery]);

  const continueProgress = continueCourse
    ? progressByCourse.get(continueCourse.id)
    : null;

  const overallProgress = useMemo(() => {
    if (!courses.length) return 0;
    const total = courses.reduce(
      (sum, course) => sum + Number(course.progressPercent || 0),
      0
    );
    return Math.round(total / courses.length);
  }, [courses]);

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => !assignment.isCompleted),
    [assignments]
  );

  const visibleAssignments = useMemo(() => {
    const list = normalizedQuery
      ? pendingAssignments.filter((assignment) =>
          String(assignment.title || "")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : pendingAssignments;

    return [...list].sort((a, b) => {
      const first = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
      const second = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
      return first - second;
    });
  }, [pendingAssignments, normalizedQuery]);

  const learningMinutes = useMemo(
    () =>
      courses.reduce(
        (sum, course) =>
          sum +
          (Number(course.durationMinutes) || 0) *
            (Number(course.progressPercent) || 0) *
            0.01,
        0
      ),
    [courses]
  );

  const courseProgress = Number(continueCourse?.progressPercent) || 0;
  const nextLesson = continueProgress?.nextLesson;
  const nextClass = nextClassSummary(continueCourse, nextLesson);
  const firstName = displayName(user.fullName);
  const listQueryActive = Boolean(normalizedQuery);

  const stats = [
    {
      icon: Layers,
      value: String(courses.length).padStart(2, "0"),
      label: "Enrolled Courses",
      to: "/student/courses",
      accent: {
        border: "border-l-[#2f80ed]",
        icon: "bg-[#eaf3ff] text-[#2f80ed]",
      },
    },
    {
      icon: Clock,
      value: formatHours(learningMinutes),
      label: "Learning Hours",
      to: "/student/courses",
      accent: {
        border: "border-l-[#f5a623]",
        icon: "bg-[#fff4e5] text-[#e08a00]",
      },
    },
    {
      icon: ClipboardCheck,
      value: String(pendingAssignments.length).padStart(2, "0"),
      label: "Assignments Due",
      to: "/student/assignments",
      accent: {
        border: "border-l-[#36a3ff]",
        icon: "bg-[#eaf3ff] text-[#36a3ff]",
      },
    },
    {
      icon: Award,
      value: String(certificates.length).padStart(2, "0"),
      label: "Certificates",
      to: "/student/certificates",
      accent: {
        border: "border-l-[#ffb020]",
        icon: "bg-[#fff4e5] text-[#e08a00]",
      },
    },
  ];

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Your Kodewar learning workspace"
      navItems={getNavigation(user.role)}
      variant="light"
      searchValue={query}
      onSearchChange={setQuery}
      notificationCount={pendingAssignments.length}
    >
      {loading ? <LightSkeleton /> : null}

      {!loading ? (
        <div className="space-y-5">
          {loadError ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {loadError}
            </div>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_254px]">
            {/* Welcome banner */}
            <section className="relative isolate flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-[#03142f] px-6 py-7 text-white shadow-[0_18px_40px_rgba(7,29,58,0.18)] sm:min-h-[300px] sm:px-9 sm:py-7">
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center bg-no-repeat" />
              </div>

              <img
                src="/laptopimagewithoutplant.png"
                alt=""
                className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-auto max-w-none object-contain object-bottom md:block"
              />

              <div className="relative z-10 max-w-full md:max-w-[62%]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#071d3c] ring-1 ring-[#ffc21b]/70">
                    <img
                      src="/kodewar-mark.png"
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  </span>
                  <span className="h-6 w-px bg-white/25" aria-hidden="true" />
                  <span className="font-display text-[13px] font-semibold tracking-[0.2em] text-white">
                    KODEWAR
                  </span>
                  <span className="font-display text-[12px] font-semibold tracking-[0.12em] text-brand-400">
                    LMS
                  </span>
                </div>

                <h1 className="student-welcome-heading mt-5 font-display text-[30px] font-bold leading-[1.05] tracking-tight sm:text-[42px]">
                  Welcome back,
                  <br />
                  <span className="relative inline-block text-brand-400">
                    {firstName}
                    <svg
                      className="absolute -bottom-2 left-0 h-3 w-full text-[#f5a900]"
                      viewBox="0 0 160 12"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8C40 3 100 2 157 5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>

                <p className="mt-4 max-w-[320px] text-[13px] leading-6 text-[#d6e7fb] sm:text-sm">
                  Every lesson brings you closer to your goals.
                </p>

                <Link
                  to={
                    continueCourse
                      ? `/student/courses/${continueCourse.id}`
                      : "/student/courses"
                  }
                  className="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-[#ffdb4d] via-[#ffc21b] to-[#f5a900] px-6 py-3 text-[15px] font-semibold text-[#071d3c] shadow-[0_10px_30px_rgba(255,183,15,0.28)] transition hover:brightness-110"
                >
                  Continue Learning
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* Progress */}
            <aside className="flex flex-col rounded-2xl border border-[#e4ecf7] bg-white p-5 shadow-[0_8px_24px_rgba(15,42,80,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#0b1c3a]">
                Your Progress
              </h2>

              <div className="mt-2 flex flex-1 items-center justify-center">
                <ProgressDonut value={overallProgress} />
              </div>

              <div
                className={cn(
                  "mt-3 mx-auto flex w-fit max-w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium",
                  overallProgress > 0
                    ? "bg-[#eaf9f0] text-[#15803d]"
                    : "bg-[#f1f6fc] text-[#5d718c]"
                )}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                {overallProgress > 0
                  ? "On track this week"
                  : "Enrol in a course to get started"}
              </div>
            </aside>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* Continue learning */}
            <section className="flex flex-col rounded-2xl border border-[#e4ecf7] bg-white p-5 shadow-[0_8px_24px_rgba(15,42,80,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#0b1c3a]">
                    Continue Learning
                  </h2>
                  <p className="mt-0.5 text-xs text-[#7b8da6]">
                    Pick up where you left off and keep making progress.
                  </p>
                </div>
                <Link
                  to="/student/courses"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2f80ed] transition hover:text-[#1f6fd6]"
                >
                  Browse My Courses
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>

              {continueCourse ? (
                <div className="mt-4 flex flex-1 items-center rounded-2xl border border-[#e9f0f9] bg-white p-4">
                  <div className="grid w-full gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="relative aspect-square w-full max-w-[180px] overflow-hidden rounded-xl bg-gradient-to-br from-[#0a2a58] via-[#0b3f86] to-[#071d3c]">
                      <svg
                        className="absolute inset-0 h-full w-full opacity-80"
                        viewBox="0 0 200 200"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M-20 170 C 30 120, 120 110, 220 140"
                          stroke="#2f80ed"
                          strokeWidth="26"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                        <path
                          d="M-30 20 C 40 40, 120 10, 220 60"
                          stroke="#ff8a00"
                          strokeWidth="10"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                      </svg>

                      {String(continueCourse.title || "")
                        .toLowerCase()
                        .includes("javascript") ? (
                        <img
                          src="/javascript-foundations.png"
                          alt=""
                          className="relative h-full w-full object-cover"
                        />
                      ) : continueCourse.thumbnailUrl ? (
                        <img
                          src={continueCourse.thumbnailUrl}
                          alt=""
                          className="relative h-full w-full object-cover"
                        />
                      ) : (
                        <span className="absolute left-1/2 top-1/2 h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] drop-shadow-[0_18px_26px_rgba(0,0,0,0.42)]">
                          <CourseBadge code={courseCode(continueCourse.title)} />
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-[21px] font-semibold text-[#0b1c3a]">
                          {continueCourse.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#7b8da6]">
                          {[
                            continueCourse.lessonCount
                              ? `${continueCourse.lessonCount} lessons`
                              : null,
                            continueCourse.assessmentCount
                              ? `${continueCourse.assessmentCount} assessment${
                                  Number(continueCourse.assessmentCount) === 1
                                    ? ""
                                    : "s"
                                }`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e9eef5]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2f80ed] to-[#4da3ff] transition-[width] duration-500"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-end text-[11px] font-medium text-[#3b4d66]">
                          <span>{courseProgress}% complete</span>
                        </div>
                      </div>

                      <div className="mt-auto border-t border-[#eef3fa] pt-4">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <CalendarDays
                              size={17}
                              className="mt-0.5 shrink-0 text-[#4b5f79]"
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-[#7b8da6]">
                                {nextClass.label}
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-medium text-[#1f3550]">
                                {nextClass.detail}
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/student/courses/${continueCourse.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f80ed] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(47,128,237,0.25)] transition hover:bg-[#1f6fd6]"
                          >
                            Continue
                            <ArrowRight size={15} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-[#dbe6f4] bg-[#f8fbff] px-5 py-8 text-center">
                  <BookOpen
                    size={22}
                    className="mx-auto text-[#2f80ed]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm font-medium text-[#0b1c3a]">
                    {listQueryActive
                      ? "No courses match your search"
                      : "You are not enrolled in a course yet"}
                  </p>
                  <p className="mt-1 text-xs text-[#7b8da6]">
                    {listQueryActive
                      ? "Try another title or clear the search field."
                      : "Browse the catalogue to start your first course."}
                  </p>
                  <Link
                    to="/student/courses"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2f80ed] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f6fd6]"
                  >
                    Browse courses
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>

            <div className="space-y-4">
              {/* Assignments */}
              <section className="rounded-2xl border border-[#e4ecf7] bg-white p-5 shadow-[0_8px_24px_rgba(15,42,80,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-[#0b1c3a]">
                    Assignments &amp; Deadlines
                  </h2>
                  <Link
                    to="/student/assignments"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2f80ed] transition hover:text-[#1f6fd6]"
                  >
                    View All
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>

                {visibleAssignments.length ? (
                  <ul className="mt-2 divide-y divide-[#eef3fa]">
                    {visibleAssignments.slice(0, 3).map((assignment) => (
                      <li key={assignment.id}>
                        <Link
                          to={`/student/assignments/${assignment.id}`}
                          className="flex items-center gap-3 py-3 transition hover:opacity-80"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2f80ed]">
                            <ClipboardCheck
                              size={18}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#26364d]">
                            {assignment.title}
                          </span>
                          <span className="shrink-0 rounded-full bg-[#fff1e0] px-2.5 py-1 text-[11px] font-medium text-[#c26b0b]">
                            {formatDue(assignment.dueAt)}
                          </span>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-[#94a3b8]"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl bg-[#f8fbff] px-4 py-5 text-center text-xs text-[#7b8da6]">
                    {listQueryActive
                      ? "No assignments match your search."
                      : "You are all caught up. No assignments are waiting."}
                  </p>
                )}
              </section>

              {/* Activity */}
              <section className="rounded-2xl border border-[#e4ecf7] bg-white p-5 shadow-[0_8px_24px_rgba(15,42,80,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-[#0b1c3a]">
                    Learning Activity
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-[#e4ecf7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5d718c]">
                    Last 7 Days
                    <ChevronDown size={13} aria-hidden="true" />
                  </span>
                </div>

                <ActivityChart progressPercent={overallProgress} />
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
