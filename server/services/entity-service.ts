import crypto from "node:crypto";
import type { EntityMap, Favorite, Memory, Message } from "../models/types";
import { repository } from "./data";
import { HttpError } from "../utils/http";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;

export async function getPersonas() { return repository.list("personas"); }
export async function getPersona(idValue: string) {
  const persona = await repository.findById("personas", idValue);
  if (!persona) throw new HttpError(404, "Persona not found");
  return persona;
}
export async function getCategories() { return repository.list("categories"); }
export async function getUser(idValue: string) {
  const user = await repository.findById("users", idValue);
  if (!user) throw new HttpError(404, "User not found");
  return user;
}
export async function getUserProfile(userId: string) {
  await getUser(userId);
  const profile = (await repository.filter("profiles", (item) => item.userId === userId))[0];
  if (!profile) throw new HttpError(404, "Profile not found");
  return profile;
}
export async function getUserConversations(userId: string) { await getUser(userId); return repository.filter("conversations", (item) => item.userId === userId); }
export async function getUserMemories(userId: string) { await getUser(userId); return repository.filter("memories", (item) => item.userId === userId); }
export async function getUserFavorites(userId: string) { await getUser(userId); return repository.filter("favorites", (item) => item.userId === userId); }

export async function createConversation(input: { userId: string; personaId?: string; title: string }) {
  await getUser(input.userId);
  if (input.personaId) await getPersona(input.personaId);
  const timestamp = now();
  return repository.insert("conversations", { id: id("conversation"), userId: input.userId, personaId: input.personaId, title: input.title, status: "active", createdAt: timestamp, updatedAt: timestamp });
}

export async function createMessage(input: { conversationId: string; personaId?: string; role: Message["role"]; content: string }) {
  const conversation = await repository.findById("conversations", input.conversationId);
  if (!conversation) throw new HttpError(404, "Conversation not found");
  if (input.personaId) await getPersona(input.personaId);
  const message: Message = { id: id("message"), conversationId: input.conversationId, personaId: input.personaId, role: input.role, content: input.content, createdAt: now() };
  return repository.insert("messages", message);
}

export async function createMemory(input: { userId: string; type: Memory["type"]; summary: string; source: string }) {
  await getUser(input.userId);
  const timestamp = now();
  return repository.insert("memories", { id: id("memory"), ...input, createdAt: timestamp, updatedAt: timestamp });
}

export async function createFavorite(input: { userId: string; personaId: string }) {
  await getUser(input.userId);
  await getPersona(input.personaId);
  const existing = (await repository.filter("favorites", (item) => item.userId === input.userId && item.personaId === input.personaId))[0];
  if (existing) return existing;
  const favorite: Favorite = { id: id("favorite"), ...input, createdAt: now() };
  return repository.insert("favorites", favorite);
}

export async function deleteFavorite(favoriteId: string) {
  if (!(await repository.remove("favorites", favoriteId))) throw new HttpError(404, "Favorite not found");
}

export async function findEntity<K extends keyof EntityMap>(entity: K, entityId: string) {
  const record = await repository.findById(entity, entityId);
  if (!record) throw new HttpError(404, "Resource not found");
  return record;
}
