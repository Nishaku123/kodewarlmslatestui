import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rmdir, stat, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import ffmpegPath from "ffmpeg-static";
import { fileTypeFromFile } from "file-type";
import { compressVideo } from "../services/videoCompression.service.js";

function createSampleVideo(outputPath, includeAudio) {
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    "testsrc2=size=1280x720:rate=30",
  ];

  if (includeAudio) {
    args.push("-f", "lavfi", "-i", "sine=frequency=440:sample_rate=44100");
  }

  args.push(
    "-t",
    "5",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p"
  );

  if (includeAudio) {
    args.push("-c:a", "aac", "-b:a", "256k", "-shortest");
  } else {
    args.push("-an");
  }

  args.push("-y", outputPath);

  return new Promise((resolve, reject) => {
    const process = spawn(ffmpegPath, args, {
      windowsHide: true,
      stdio: "ignore",
    });
    process.once("error", reject);
    process.once("close", (exitCode) => {
      if (exitCode === 0) resolve();
      else reject(new Error(`Sample video generation exited with ${exitCode}.`));
    });
  });
}

for (const includeAudio of [false, true]) {
  test(`compresses sample MP4 ${includeAudio ? "with" : "without"} audio`, async (context) => {
    const workDir = await mkdtemp(path.join(tmpdir(), "kodewar-video-test-"));
    const sourcePath = path.join(workDir, "sample.mp4");
    let compressedPath;

    context.after(async () => {
      await Promise.all(
        [sourcePath, compressedPath]
          .filter(Boolean)
          .map((filePath) => unlink(filePath).catch(() => {}))
      );
      await rmdir(workDir).catch(() => {});
    });

    await createSampleVideo(sourcePath, includeAudio);
    const original = await stat(sourcePath);
    const compressed = await compressVideo(sourcePath);
    compressedPath = compressed.path;

    assert.ok(
      compressed.size < original.size,
      `expected ${compressed.size} bytes to be smaller than ${original.size}`
    );
    assert.equal((await fileTypeFromFile(compressed.path))?.mime, "video/mp4");
  });
}
