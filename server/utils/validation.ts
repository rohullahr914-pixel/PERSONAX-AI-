import { HttpError } from "./http";

export function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new HttpError(400, `${field} is required`);
  return value.trim();
}

export function idParam(value: unknown, field = "id") {
  const id = requiredString(value, field);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new HttpError(400, `${field} has an invalid format`);
  return id;
}

export function email(value: unknown) {
  const normalized = requiredString(value, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new HttpError(400, "email has an invalid format");
  return normalized;
}

export function timestamp(value: unknown, field: string) {
  const parsed = new Date(requiredString(value, field));
  if (Number.isNaN(parsed.getTime())) throw new HttpError(400, `${field} must be a valid timestamp`);
  return parsed.toISOString();
}
