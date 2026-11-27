import { BookOpen, Clock, PlayCircle, PlusCircle, Signal } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import Button from "../ui/Button.jsx";
import { cn } from "../../utils/cn.js";

const statusTones = {
  "In progress": "brand",
  Completed: "success",
  "Not started": "neutral",
  Available: "neutral",
};

/**
 * Course card shared by the course catalogue and design-system preview.
 */
export default function CourseCard({
  course,
  onContinue,
  onEnroll,
  isEnrolled = true,
  showProgress = true,
  actionDisabled = false,
  actionLoading = false,
  light = false,
}) {
  const {
    title,
    description,
    category = "Course",
    level = "Beginner",
    lessonCount = 0,
    duration = "",
    thumbnailUrl = "",
    progress = 0,
    status = "Not started",
  } = course;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition duration-200",
        light
          ? "border-[#d8e6f8] bg-none bg-white/95 shadow-[0_12px_28px_rgba(15,42,80,0.12)] hover:-translate-y-1 hover:border-[#9bb7da] hover:shadow-[0_18px_36px_rgba(15,42,80,0.16)]"
          : "hover:border-ink-600"
      )}
    >
      <div
        className={cn(
          "relative flex h-40 items-end overflow-hidden bg-gradient-to-br from-brand-600/25 via-ink-800 to-cyan-500/10 p-4",
          light && "bg-gradient-to-br from-[#dcecff] via-[#a9cfff] to-[#0b3b80]"
        )}
      >
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-ink-950/10"
              aria-hidden="true"
            />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
            aria-hidden="true"
          />
        )}

        <div className="relative flex w-full items-center justify-between gap-2">
          <Badge tone="brand" light={light}>{category}</Badge>
          <Badge
            tone={statusTones[isEnrolled ? status : "Available"] || "neutral"}
            dot
            light={light}
          >
            {isEnrolled ? status : "Available"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className={cn(
            "line-clamp-1 font-display text-base font-semibold text-white",
            light && "font-semibold text-[#0b1c3a]"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1.5 line-clamp-2 text-xs leading-5 text-mist-500",
            light && "text-[#637590]"
          )}
        >
          {description}
        </p>

        <div
          className={cn(
            "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-mist-500",
            light && "text-[#637590]"
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={13} aria-hidden="true" />
            {lessonCount} lessons
          </span>
          {duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" />
              {duration}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Signal size={13} aria-hidden="true" />
            {level}
          </span>
        </div>

        {showProgress ? (
          <ProgressBar
            value={progress}
            label="Course progress"
            className="mt-5"
            light={light}
          />
        ) : null}

        <div className="mt-auto pt-5">
          <Button
            variant={isEnrolled ? "secondary" : "primary"}
            fullWidth
            loading={actionLoading}
            icon={isEnrolled ? PlayCircle : PlusCircle}
            disabled={actionDisabled}
            light={light}
            onClick={() =>
              isEnrolled ? onContinue?.(course) : onEnroll?.(course)
            }
          >
            {isEnrolled
              ? progress > 0
                ? "Continue learning"
                : "Open course"
              : "Enrol in course"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
