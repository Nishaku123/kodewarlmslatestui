import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import CourseCard from "../../components/course/CourseCard.jsx";
import StudentPageTitle from "../../components/layout/StudentPageTitle.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getNavigation } from "../../config/navigation.js";
import {
  enrollInCourseRequest,
  getCourseCatalogueRequest,
  getMyCoursesRequest,
} from "../../services/courses.js";

function formatDuration(minutes) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes} min`;
  return remainingMinutes
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} hr`;
}

function CourseGrid({
  courses,
  onOpen,
  onEnroll,
  enrollingCourseId,
  light = false,
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            ...course,
            duration: formatDuration(course.durationMinutes),
            progress: course.progressPercent ?? 0,
            status: course.isComplete
              ? "Completed"
              : course.progressPercent > 0
                ? "In progress"
                : "Not started",
          }}
          isEnrolled={Boolean(course.isEnrolled)}
          showProgress={Boolean(course.isEnrolled)}
          light={light}
          actionDisabled={enrollingCourseId === course.id}
          actionLoading={enrollingCourseId === course.id}
          onContinue={() => onOpen(course)}
          onEnroll={() => onEnroll(course)}
        />
      ))}
    </div>
  );
}

function CourseArtwork({ course }) {
  const isJavaScript = String(course.title || "")
    .toLowerCase()
    .includes("javascript");
  const initials = String(course.title || "Course")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <div
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_55%_55%,rgba(0,132,255,0.42),transparent_58%),linear-gradient(145deg,#082d66_0%,#041a3a_48%,#031127_100%)]"
      role="img"
      aria-label={`${course.title} course artwork`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 340"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <ellipse
          cx="267"
          cy="174"
          rx="214"
          ry="93"
          transform="rotate(-13 267 174)"
          stroke="#168cff"
          strokeWidth="3"
          opacity="0.9"
        />
        <ellipse
          cx="286"
          cy="190"
          rx="203"
          ry="83"
          transform="rotate(12 286 190)"
          stroke="#ff8a00"
          strokeWidth="2"
          opacity="0.75"
        />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,transparent_26%,rgba(3,14,32,0.42)_82%)]" />

      <div className="absolute bottom-8 left-[8%] right-[8%] z-[1] h-5 skew-x-[-18deg] rounded-b-2xl border border-[#78d7ff]/80 bg-gradient-to-b from-[#d7efff] via-[#7899bd] to-[#1d3151] shadow-[0_10px_28px_rgba(0,119,255,0.45)]" />

      <div className="relative z-[2] w-[84%] max-w-[390px] -translate-y-3 -rotate-[3deg] rounded-[18px] border-[3px] border-[#43c8ff] bg-[#061a37] p-2.5 shadow-[0_0_32px_rgba(0,142,255,0.55)] sm:p-3">
        <div className="flex h-6 items-center gap-1.5 border-b border-white/10 px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5e58]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc42e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#24d46a]" />
          <span className="ml-auto h-1.5 w-12 rounded-full bg-[#28456d]" />
        </div>

        <div className="overflow-hidden px-2 py-3 font-mono text-[9px] leading-[1.8] text-[#d9e8ff] sm:px-4 sm:text-[11px]">
          <p>
            <span className="text-[#d886ff]">const</span>{" "}
            <span className="text-[#67ccff]">add</span> = (a, b) =&gt; {"{"}
          </p>
          <p className="pl-4">
            <span className="text-[#c6e879]">return</span> a + b;
          </p>
          <p>{"};"}</p>
          <p className="mt-2">
            <span className="text-[#d886ff]">const</span>{" "}
            <span className="text-[#67ccff]">numbers</span> = [1, 2, 3];
          </p>
          <p>
            <span className="text-[#d886ff]">const</span> total = numbers.
            <span className="text-[#ffc857]">reduce</span>(
          </p>
          <p className="pl-4">
            (sum, n) =&gt; sum + n, <span className="text-[#ffbd61]">0</span>
          </p>
          <p>);</p>
        </div>
      </div>

      {isJavaScript ? (
        <img
          src="/javascript-foundations.png"
          alt=""
          className="absolute bottom-5 left-[10%] z-[3] h-[68px] w-[68px] -rotate-6 drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)] sm:h-[82px] sm:w-[82px]"
        />
      ) : (
        <span className="absolute bottom-6 left-[10%] z-[3] flex h-[68px] w-[68px] -rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffe978] to-[#f4a900] font-display text-xl font-bold text-[#071d3c] shadow-[0_12px_18px_rgba(0,0,0,0.45)] sm:h-[82px] sm:w-[82px]">
          {initials}
        </span>
      )}
    </div>
  );
}

function EnrolledCourseCard({ course, onOpen }) {
  const progress = Math.min(
    100,
    Math.max(0, Number(course.progressPercent) || 0)
  );
  const isComplete = Boolean(course.isComplete) || progress >= 100;
  const isJavaScript = String(course.title || "")
    .toLowerCase()
    .includes("javascript");
  const duration = formatDuration(course.durationMinutes);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#d8e6f8] bg-white shadow-[0_12px_28px_rgba(15,42,80,0.12)] transition duration-200 hover:-translate-y-1 hover:border-[#9bb7da] hover:shadow-[0_18px_36px_rgba(15,42,80,0.16)]">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#061a37]">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : isJavaScript ? (
          <img
            src="/javascript-course-artwork.png"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <CourseArtwork course={course} />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061a37]/70 via-transparent to-[#061a37]/20" />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/70 bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#1b2b45] shadow-sm">
          {course.category || "Course"}
        </span>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm ${
            isComplete
              ? "border-[#a7ddc0] bg-[#ecfdf3] text-[#137044]"
              : "border-[#f1d28d] bg-[#fff8e6] text-[#956000]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isComplete ? "bg-[#16a878]" : "bg-[#ed9e19]"
            }`}
            aria-hidden="true"
          />
          {isComplete ? "Completed" : progress > 0 ? "In progress" : "Not started"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-1 font-display text-lg font-bold leading-6 tracking-tight text-[#0b1c3a]">
          {course.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#526782]">
          {course.description || "Continue learning at your own pace."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#526782]">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} aria-hidden="true" />
            {course.lessonCount || 0} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden="true" />
            {duration || "Self-paced"}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#526782]">Progress</span>
            <span className="font-bold text-[#0b1c3a]">
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Course progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#18a874] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => onOpen(course)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216fe4]"
          >
            Continue learning
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function StudentCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const loadCourses = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const [catalogueResponse, myCoursesResponse] = await Promise.all([
        getCourseCatalogueRequest(),
        getMyCoursesRequest(),
      ]);
      setCatalogue(catalogueResponse.data.courses);
      setMyCourses(myCoursesResponse.data.courses);
      setStatus("success");
    } catch (requestError) {
      setError(requestError.message || "Could not load courses.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const availableCourses = useMemo(
    () => catalogue.filter((course) => !course.isEnrolled),
    [catalogue]
  );

  async function handleEnroll(course) {
    setEnrollingCourseId(course.id);

    try {
      await enrollInCourseRequest(course.id);
      toast({
        tone: "success",
        title: "You're enrolled",
        description: `${course.title} is now in your courses.`,
      });
      await loadCourses();
    } catch (requestError) {
      toast({
        tone: "danger",
        title: "Could not enrol",
        description: requestError.message || "Please try again.",
      });
    } finally {
      setEnrollingCourseId(null);
    }
  }

  return (
    <DashboardLayout
      title="My Courses"
      subtitle="Your Kodewar learning workspace"
      navItems={getNavigation(user.role)}
      variant="light"
      showHome
      showRole
      mainClassName="mx-auto w-full max-w-none p-0"
    >
      <div className="min-h-[calc(100vh-4rem)] bg-[#f3f7fd]">
        <div className="mx-auto w-full max-w-[1400px] space-y-8 px-4 py-6 sm:px-8 lg:px-[60px] lg:py-8">
          <header>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f07600]">
              <span className="h-0.5 w-8 bg-[#ff9700]" aria-hidden="true" />
              Student workspace
            </p>
            <StudentPageTitle title="Courses" accent="Courses" className="mt-2" />
            <p className="mt-1 max-w-[460px] text-sm leading-6 text-[#243957]">
              Browse published courses, enrol, and explore each course&apos;s
              weekly modules and lessons.
            </p>
          </header>

          {status === "loading" ? (
            <div className="space-y-8" aria-label="Loading courses">
              <Skeleton className="h-[350px] rounded-3xl bg-white/65" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-72 rounded-xl bg-white/65"
                  />
                ))}
              </div>
            </div>
          ) : status === "error" ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-300 bg-white/75 p-5 text-sm text-rose-700 shadow-lg"
            >
              <p>{error}</p>
              <button
                type="button"
                className="mt-3 font-semibold underline underline-offset-4"
                onClick={loadCourses}
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <section aria-labelledby="enrolled-courses-heading">
                <div className="mb-4">
                  <h2
                    id="enrolled-courses-heading"
                    className="student-page-heading font-display text-[21px] font-bold tracking-tight text-[#101f3c]"
                  >
                    My learning
                  </h2>
                  <span className="mt-1 block text-sm font-semibold text-[#1263e8]">
                    {myCourses.length} enrolled{" "}
                    {myCourses.length === 1 ? "course" : "courses"}
                  </span>
                </div>

                {myCourses.length ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {myCourses.map((course) => (
                      <EnrolledCourseCard
                        key={course.id}
                        course={course}
                        onOpen={(selectedCourse) =>
                          navigate(`/student/courses/${selectedCourse.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={GraduationCap}
                    title="You haven't enrolled in a course yet"
                    description="Choose a published course from the catalogue below to get started."
                    className="py-8"
                    light
                  />
                )}
              </section>

              <section aria-labelledby="course-catalogue-heading">
                <div className="mb-4">
                  <h2
                    id="course-catalogue-heading"
                    className="student-page-heading font-display text-[21px] font-bold tracking-tight text-[#101f3c]"
                  >
                    Course catalogue
                  </h2>
                  <p className="mt-1 text-xs text-[#344a6a]">
                    Published courses available to students
                  </p>
                </div>

                {availableCourses.length ? (
                  <CourseGrid
                    courses={availableCourses}
                    onOpen={(course) =>
                      navigate(`/student/courses/${course.id}`)
                    }
                    onEnroll={handleEnroll}
                    enrollingCourseId={enrollingCourseId}
                    light
                  />
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No new courses available"
                    description={
                      catalogue.length
                        ? "You're enrolled in every course currently in the catalogue."
                        : "There are no published courses yet. The catalogue will show courses once course content is added and published."
                    }
                    className="py-8 [&>span]:!border-[#bad4fa] [&>span]:!bg-[#eaf3ff] [&>span]:!text-[#2475df] [&>h3]:!text-[#0b1c3a] [&>p]:!text-[#344a6a]"
                    light
                  />
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
