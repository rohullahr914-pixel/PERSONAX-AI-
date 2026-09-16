import path from "node:path";
import { env } from "../config/env";
import { JsonRepository } from "../models/repository";

export const repository = new JsonRepository(path.resolve(process.cwd(), env.dataDir));
