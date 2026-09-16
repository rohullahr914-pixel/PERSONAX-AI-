import type { RequestHandler } from "express";
import { HttpError, fail } from "../utils/http";

export const notFound: RequestHandler = (_req, res) => fail(res, new HttpError(404, "Resource not found"));
