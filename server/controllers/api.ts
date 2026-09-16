import type { Request, Response } from "express";
import * as service from "../services/entity-service";
import { HttpError, success } from "../utils/http";
import { email, idParam, requiredString } from "../utils/validation";

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
