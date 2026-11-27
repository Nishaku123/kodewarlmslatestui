import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
  destination: tmpdir(),
  filename: (_req, _file, callback) => callback(null, randomUUID()),
});

export function parseMediaUpload(req, res, next) {
  const { kind } = req.params;

  if (kind !== "image" && kind !== "video") {
    return next(ApiError.badRequest("Upload type must be image or video."));
  }

  if (!env.b2.enabled) {
    return next(
      new ApiError(
        503,
        "Backblaze media storage is not configured. Add the B2 settings to backend/.env."
      )
    );
  }

  const maxSizeMb =
    kind === "image"
      ? env.uploads.maxFileSizeMb
      : env.uploads.maxVideoFileSizeMb;
  const upload = multer({
    storage,
    limits: { fileSize: maxSizeMb * 1024 * 1024, files: 1 },
  }).single("file");

  upload(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return next(
        new ApiError(
          413,
          `File exceeds the ${maxSizeMb} MB limit for ${kind} uploads.`
        )
      );
    }

    if (error instanceof multer.MulterError) {
      return next(ApiError.badRequest("Upload one file using the file field."));
    }

    return next(error);
  });
}
