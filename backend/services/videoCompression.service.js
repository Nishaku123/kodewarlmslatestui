import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { stat, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { ApiError } from "../utils/ApiError.js";

const compressionTimeoutMs = 25 * 60 * 1000;

async function removeOutputFile(filePath) {
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[VIDEO COMPRESSION CLEANUP]", error);
    }
  }
}

function runFfmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new ApiError(503, "Video compression is unavailable on this server."));
      return;
    }

    const args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      inputPath,
      "-map",
      "0:v:0",
      "-map",
      "0:a?",
      "-vf",
      "scale='if(gte(iw,ih),trunc(min(1280,iw)/2)*2,-2)':'if(gte(iw,ih),-2,trunc(min(1280,ih)/2)*2)'",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outputPath,
    ];

    const process = spawn(ffmpegPath, args, {
      windowsHide: true,
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      process.kill("SIGKILL");
    }, compressionTimeoutMs);

    process.stderr.setEncoding("utf8");
    process.stderr.on("data", (chunk) => {
      stderr = `${stderr}${chunk}`.slice(-4000);
    });

    process.once("error", (error) => {
      clearTimeout(timeout);
      console.error("[VIDEO COMPRESSION START ERROR]", error.message);
      reject(new ApiError(503, "Could not start video compression."));
    });

    process.once("close", (exitCode) => {
      clearTimeout(timeout);

      if (timedOut) {
        reject(
          new ApiError(
            504,
            "Video compression took too long. Try a smaller source video."
          )
        );
        return;
      }

      if (exitCode !== 0) {
        console.error("[VIDEO COMPRESSION ERROR]", {
          exitCode,
          stderr: stderr.trim(),
        });
        reject(
          new ApiError(
            422,
            "Could not compress this video. Try another MP4, MOV, or WebM file."
          )
        );
        return;
      }

      resolve();
    });
  });
}

export async function compressVideo(inputPath) {
  const outputPath = path.join(tmpdir(), `${randomUUID()}.mp4`);

  try {
    await runFfmpeg(inputPath, outputPath);
    const output = await stat(outputPath);

    if (output.size === 0) {
      throw new ApiError(422, "Video compression produced an empty file.");
    }

    return { path: outputPath, size: output.size };
  } catch (error) {
    await removeOutputFile(outputPath);
    throw error;
  }
}
