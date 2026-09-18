import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/server/db";
import type { AppUser } from "@/lib/auth";

const SESSION_COOKIE = "personax_session";
const SESSION_DAYS = 30;

type UserRow = { id: string; name: string; email: string; language: AppUser["language"]; created_at: Date };

function publicUser(row: UserRow): AppUser {
  return { id: row.id, name: row.name, email: row.email, language: row.language, createdAt: row.created_at.toISOString() };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query("INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)", [randomUUID(), userId, hashToken(token), expiresAt]);
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt, priority: "high" });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAuthenticatedUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = await query<UserRow>(`SELECT u.id, u.name, u.email, u.language, u.created_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = $1 AND s.expires_at > now()`, [hashToken(token)]);
  return result.rows[0] ? publicUser(result.rows[0]) : null;
}

export async function requireUser() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
