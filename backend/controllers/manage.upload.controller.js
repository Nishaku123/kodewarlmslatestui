import { unlink } from "node:fs/promises";
import { fileTypeFromFile } from "file-type";
import {
  createB2DownloadUrl,
  uploadMediaToB2,
} from "../services/b2Storage.service.js";
import { compressVideo } from "../services/videoCompression.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const imageExtensions = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const videoExtensions = {
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export const uploadMediaHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("Choose a file to upload.");
  }

  let compressedPath;
  try {
    const detectedType = await fileTypeFromFile(req.file.path);
    const extensionMap =
      req.params.kind === "image" ? imageExtensions : videoExtensions;
    let extension = detectedType && extensionMap[detectedType.mime];

    if (!extension) {
      throw ApiError.badRequest(
        req.params.kind === "image"
          ? "Choose a JPEG, PNG, GIF or WebP image."
          : "Choose an MP4, MOV or WebM video."
      );
    }

    let uploadPath = req.file.path;
    let contentType = detectedType.mime;
    let size = req.file.size;

    if (req.params.kind === "video") {
      const compressed = await compressVideo(req.file.path);
      compressedPath = compressed.path;

      if (compressed.size < req.file.size) {
        uploadPath = compressed.path;
        extension = "mp4";
        contentType = "video/mp4";
        size = compressed.size;
      }
    }

    const stored = await uploadMediaToB2(uploadPath, {
      kind: req.params.kind,
      contentType,
      extension,
      size,
    });
    const previewUrl = await createB2DownloadUrl(stored.url);

    res.status(201).json({
      success: true,
      message: "Media uploaded.",
      data: {
        asset: {
          ...stored,
          previewUrl,
          contentType,
          size,
          ...(req.params.kind === "video"
            ? {
                originalSize: req.file.size,
                compressed: uploadPath === compressedPath,
              }
            : {}),
        },
      },
    });
  } finally {
    const temporaryFiles = new Set(
      [req.file.path, compressedPath].filter(Boolean)
    );
    for (const filePath of temporaryFiles) {
      try {
        await unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("[MEDIA UPLOAD CLEANUP]", error);
        }
      }
    }
  }
});
