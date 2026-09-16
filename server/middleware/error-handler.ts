import type { ErrorRequestHandler } from "express";
import { fail } from "../utils/http";

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
	void next;
	return fail(res, error);
};
