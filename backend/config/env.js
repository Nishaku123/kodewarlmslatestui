import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load backend/.env no matter which folder the command is run from.
const currentFolder = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentFolder, "../.env"), quiet: true });

/**
 * Reads a variable that must exist.
 * Failing early with a clear message is much easier to debug than a
 * confusing database error later.
 */
function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `Missing environment variable "${name}". ` +
        "Copy backend/.env.example to backend/.env and fill in the values."
    );
  }
  return value.trim();
}

function optional(name, fallback) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : fallback;
}

const nodeEnv = optional("NODE_ENV", "development");
const port = Number(optional("PORT", "5000"));
const dbName = optional("DB_NAME", "kodewar_lms");
const clientUrl = optional("CLIENT_URL", "http://localhost:5173");
const jwtSecret = required("JWT_SECRET");
const b2KeyId = optional("B2_APPLICATION_KEY_ID", "");
const b2ApplicationKey = optional("B2_APPLICATION_KEY", "");
const b2BucketName = optional("B2_BUCKET_NAME", "");
const b2Region = optional("B2_REGION", "");
const maxImageFileSizeMb = Number(optional("MAX_FILE_SIZE_MB", "10"));
const maxVideoFileSizeMb = Number(optional("MAX_VIDEO_FILE_SIZE_MB", "500"));

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a whole number between 1 and 65535.");
}

// The database name is inserted into a CREATE DATABASE statement later,
// so we only allow safe characters.
if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
  throw new Error("DB_NAME may only contain letters, numbers and underscores.");
}

if (Boolean(b2KeyId) !== Boolean(b2ApplicationKey)) {
  throw new Error(
    "B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY must be configured together."
  );
}

if ((b2KeyId || b2ApplicationKey) && (!b2BucketName || !b2Region)) {
  throw new Error(
    "B2_BUCKET_NAME and B2_REGION are required when Backblaze credentials are configured."
  );
}

if (b2BucketName && !/^[a-z0-9][a-z0-9-]{4,48}[a-z0-9]$/.test(b2BucketName)) {
  throw new Error("B2_BUCKET_NAME must be a valid 6-50 character bucket name.");
}

if (b2Region && !/^[a-z]{2}-[a-z]+-\d{3}$/.test(b2Region)) {
  throw new Error("B2_REGION must be a valid Backblaze region, such as us-east-005.");
}

if (
  !Number.isInteger(maxImageFileSizeMb) ||
  maxImageFileSizeMb < 1 ||
  !Number.isInteger(maxVideoFileSizeMb) ||
  maxVideoFileSizeMb < 1
) {
  throw new Error("Upload size limits must be positive whole numbers in megabytes.");
}

if (nodeEnv === "production") {
  if (jwtSecret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production."
    );
  }

  if (!/^https:\/\//i.test(clientUrl)) {
    throw new Error(
      "CLIENT_URL must use https:// in production so cookies and CORS stay secure."
    );
  }
}

export const env = Object.freeze({
  nodeEnv,
  port,
  clientUrl,
  serveFrontend:
    nodeEnv === "production" && optional("SERVE_FRONTEND", "true") === "true",
  db: Object.freeze({
    host: required("DB_HOST"),
    port: Number(optional("DB_PORT", "4000")),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    name: dbName,
    ssl: optional("DB_SSL", "true") === "true",
  }),
  jwt: Object.freeze({
    secret: jwtSecret,
    expiresIn: optional("JWT_EXPIRES_IN", "7d"),
  }),
  uploads: Object.freeze({
    maxFileSizeMb: maxImageFileSizeMb,
    maxVideoFileSizeMb,
  }),
  b2: Object.freeze({
    enabled: Boolean(b2KeyId && b2ApplicationKey && b2BucketName && b2Region),
    applicationKeyId: b2KeyId,
    applicationKey: b2ApplicationKey,
    bucketName: b2BucketName,
    region: b2Region,
  }),
});
