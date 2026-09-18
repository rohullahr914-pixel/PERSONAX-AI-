import type { Request, Response } from "express";
import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import * as service from "../services/entity-service";
import { HttpError, success } from "../utils/http";
import { email, idParam, requiredString } from "../utils/validation";
import { repository } from "../services/data";

const adminTokens = new Set<string>();

function adminToken(req: Request) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !adminTokens.has(token)) throw new HttpError(401, "Admin authentication required");
}

function device(userAgent: string) { return /mobile|android|iphone|ipad/i.test(userAgent) ? "Mobile" : "Desktop"; }
function browser(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/chrome\//i.test(userAgent)) return "Chrome";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return "Safari";
  return "Other";
}

export async function adminLogin(req: Request, res: Response) {
  const requestedEmail = String(req.body.email ?? "").trim().toLowerCase();
  const requestedPassword = String(req.body.password ?? "");
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) throw new HttpError(503, "Admin credentials are not configured");
  if (requestedEmail !== process.env.ADMIN_EMAIL.trim().toLowerCase() || !(await bcrypt.compare(requestedPassword, process.env.ADMIN_PASSWORD_HASH))) throw new HttpError(401, "Email or password is incorrect");
  const token = randomBytes(32).toString("hex");
  adminTokens.add(token);
  return success(res, { token });
}

export async function adminEvent(req: Request, res: Response) {
  const eventType = req.body.eventType;
  if (eventType !== "page_view") throw new HttpError(400, "Unsupported analytics event");
  const userAgent = req.header("user-agent") ?? "";
  const event = { id: randomUUID(), eventType, path: String(req.body.path ?? "/").slice(0, 500), country: req.header("x-vercel-ip-country") ?? req.header("cf-ipcountry") ?? "Unknown", device: device(userAgent), browser: browser(userAgent), referrer: String(req.body.referrer ?? "").slice(0, 500), visitorId: String(req.body.visitorId ?? req.ip ?? "anonymous").slice(0, 120), createdAt: new Date().toISOString() } as const;
  await repository.insert("analyticsEvents", event);
  return success(res, { recorded: true }, 201);
}

export async function adminAnalytics(req: Request, res: Response) {
  adminToken(req);
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const events = (await repository.list("analyticsEvents")).filter((event) => new Date(event.createdAt).getTime() >= since && event.eventType === "page_view");
  const count = (key: "country" | "device" | "browser" | "path") => Object.entries(events.reduce<Record<string, number>>((result, event) => { const value = event[key]; result[value] = (result[value] ?? 0) + 1; return result; }, {})).map(([label, value]) => ({ label, count: String(value) })).sort((a, b) => Number(b.count) - Number(a.count)).slice(0, 8);
  return success(res, { overview: { total: String(events.length), visitors: String(new Set(events.map((event) => event.visitorId)).size), sessions: "0" }, countries: count("country"), devices: count("device"), pages: count("path"), browsers: count("browser") });
}

export async function personas(_req: Request, res: Response) { return success(res, await service.getPersonas()); }
export async function persona(req: Request, res: Response) { return success(res, await service.getPersona(idParam(req.params.id))); }
export async function categories(_req: Request, res: Response) { return success(res, await service.getCategories()); }
export async function user(req: Request, res: Response) { return success(res, await service.getUser(idParam(req.params.id))); }
export async function profile(req: Request, res: Response) { return success(res, await service.getUserProfile(idParam(req.params.id, "userId"))); }
export async function conversations(req: Request, res: Response) { return success(res, await service.getUserConversations(idParam(req.params.userId, "userId"))); }
export async function memories(req: Request, res: Response) { return success(res, await service.getUserMemories(idParam(req.params.userId, "userId"))); }
export async function favorites(req: Request, res: Response) { return success(res, await service.getUserFavorites(idParam(req.params.userId, "userId"))); }

export async function createConversation(req: Request, res: Response) {
  const userId = idParam(req.body.userId, "userId");
  const title = requiredString(req.body.title, "title");
  return success(res, await service.createConversation({ userId, personaId: req.body.personaId ? idParam(req.body.personaId, "personaId") : undefined, title }), 201);
}
export async function createMessage(req: Request, res: Response) {
  const conversationId = idParam(req.body.conversationId, "conversationId");
  const content = requiredString(req.body.content, "content");
  const role = req.body.role;
  if (!(["user", "assistant", "system"] as const).includes(role)) throw new HttpError(400, "role must be user, assistant, or system");
  return success(res, await service.createMessage({ conversationId, personaId: req.body.personaId ? idParam(req.body.personaId, "personaId") : undefined, role, content }), 201);
}
export async function createMemory(req: Request, res: Response) {
  const type = req.body.type;
  if (!(["preference", "fact", "goal"] as const).includes(type)) throw new HttpError(400, "type must be preference, fact, or goal");
  return success(res, await service.createMemory({ userId: idParam(req.body.userId, "userId"), type, summary: requiredString(req.body.summary, "summary"), source: requiredString(req.body.source, "source") }), 201);
}
export async function createFavorite(req: Request, res: Response) {
  return success(res, await service.createFavorite({ userId: idParam(req.body.userId, "userId"), personaId: idParam(req.body.personaId, "personaId") }), 201);
}
export async function deleteFavorite(req: Request, res: Response) {
  await service.deleteFavorite(idParam(req.params.id));
  return success(res, { deleted: true });
}

export async function validateUserInput(req: Request, res: Response) {
  return success(res, { email: email(req.body.email), valid: true });
}
