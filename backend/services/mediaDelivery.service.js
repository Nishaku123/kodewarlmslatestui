import { createB2DownloadUrl } from "./b2Storage.service.js";

export async function signCourseThumbnail(course) {
  if (!course?.thumbnailUrl) return course;

  return {
    ...course,
    thumbnailUrl: await createB2DownloadUrl(course.thumbnailUrl),
  };
}

export async function signCourseThumbnails(courses) {
  return Promise.all(courses.map(signCourseThumbnail));
}

export async function addCourseThumbnailPreview(course) {
  if (!course) return course;

  return {
    ...course,
    thumbnailPreviewUrl: await createB2DownloadUrl(course.thumbnailUrl),
  };
}

export async function signLessonVideo(lesson) {
  if (
    lesson?.isUnlocked !== true ||
    lesson.videoProvider !== "backblaze" ||
    !lesson.videoUrl
  ) {
    return lesson;
  }

  return {
    ...lesson,
    videoUrl: await createB2DownloadUrl(lesson.videoUrl),
  };
}

export async function signModuleVideos(modules) {
  return Promise.all(
    modules.map(async (module) => ({
      ...module,
      lessons: await Promise.all(module.lessons.map(signLessonVideo)),
    }))
  );
}
