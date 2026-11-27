import { randomUUID } from "node:crypto";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "node:fs";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

let client;
const downloadUrlExpiresInSeconds = 6 * 60 * 60;

function getClient() {
  if (!env.b2.enabled) {
    throw new ApiError(
      503,
      "Backblaze media storage is not configured. Add the B2 settings to backend/.env."
    );
  }

  if (!client) {
    client = new S3Client({
      endpoint: `https://s3.${env.b2.region}.backblazeb2.com`,
      region: env.b2.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.b2.applicationKeyId,
        secretAccessKey: env.b2.applicationKey,
      },
    });
  }

  return client;
}

export async function uploadMediaToB2(
  filePath,
  { kind, contentType, extension, size }
) {
  const key = `${kind}/${randomUUID()}.${extension}`;

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: env.b2.bucketName,
        Key: key,
        Body: createReadStream(filePath),
        ContentLength: size,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
  } catch (error) {
    const code = error.Code || error.name;
    const requestId = error.$metadata?.requestId;

    console.error("[B2 UPLOAD ERROR]", {
      code,
      httpStatusCode: error.$metadata?.httpStatusCode,
      requestId,
    });

    const message =
      code === "InvalidAccessKeyId"
        ? "Backblaze rejected the key ID. Check that B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY belong to the same application key."
        : code === "SignatureDoesNotMatch"
          ? "Backblaze rejected the application key secret. Verify B2_APPLICATION_KEY for this key ID."
          : code === "NoSuchBucket"
            ? "Backblaze could not find the configured bucket. Check B2_BUCKET_NAME and B2_REGION."
            : code === "AccessDenied"
              ? "The Backblaze application key lacks permission to upload to this bucket."
              : "Backblaze rejected the upload. Check the configured key, bucket, and region.";

    throw new ApiError(502, message);
  }

  const downloadHost = `https://f${env.b2.region.slice(-3)}.backblazeb2.com`;
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return {
    key,
    url: `${downloadHost}/file/${encodeURIComponent(env.b2.bucketName)}/${encodedKey}`,
  };
}

export async function createB2DownloadUrl(mediaUrl) {
  if (!mediaUrl) return mediaUrl;

  let url;
  try {
    url = new URL(mediaUrl);
  } catch {
    return mediaUrl;
  }

  if (!/^f\d{3}\.backblazeb2\.com$/i.test(url.hostname)) {
    return mediaUrl;
  }

  const expectedHost = `f${env.b2.region.slice(-3)}.backblazeb2.com`;
  if (url.hostname.toLowerCase() !== expectedHost) {
    throw ApiError.badRequest(
      "This Backblaze media URL does not match the configured region."
    );
  }

  let segments;
  try {
    segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
  } catch {
    throw ApiError.badRequest("This Backblaze media URL is malformed.");
  }

  if (
    segments.length < 3 ||
    segments[0] !== "file" ||
    segments[1] !== env.b2.bucketName
  ) {
    throw ApiError.badRequest(
      "This Backblaze media URL does not match the configured bucket."
    );
  }

  const key = segments.slice(2).join("/");
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({
      Bucket: env.b2.bucketName,
      Key: key,
    }),
    { expiresIn: downloadUrlExpiresInSeconds }
  );
}
