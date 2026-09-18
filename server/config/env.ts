import "dotenv/config";

function positiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  port: positiveInt(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  dataDir: process.env.DATA_DIR ?? "./data",
  databaseUrl: process.env.DATABASE_URL ?? "",
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
} as const;
