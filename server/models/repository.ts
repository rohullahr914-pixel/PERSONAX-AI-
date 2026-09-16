import fs from "node:fs/promises";
import path from "node:path";
import type { EntityMap } from "./types";

export class JsonRepository {
  constructor(private readonly dataDir: string) {}

  private fileName(entity: string) {
    return path.join(this.dataDir, `${entity}.json`);
  }

  async list<K extends keyof EntityMap>(entity: K): Promise<EntityMap[K][]> {
    const raw = await fs.readFile(this.fileName(String(entity)), "utf8");
    return JSON.parse(raw) as EntityMap[K][];
  }

  async findById<K extends keyof EntityMap>(entity: K, id: string) {
    const records = await this.list(entity);
    return records.find((record) => record.id === id);
  }

  async filter<K extends keyof EntityMap>(entity: K, predicate: (record: EntityMap[K]) => boolean) {
    return (await this.list(entity)).filter(predicate);
  }

  async insert<K extends keyof EntityMap>(entity: K, record: EntityMap[K]) {
    const records = await this.list(entity);
    records.push(record);
    await fs.writeFile(this.fileName(String(entity)), `${JSON.stringify(records, null, 2)}\n`, "utf8");
    return record;
  }

  async remove<K extends keyof EntityMap>(entity: K, id: string) {
    const records = await this.list(entity);
    const next = records.filter((record) => record.id !== id);
    if (next.length === records.length) return false;
    await fs.writeFile(this.fileName(String(entity)), `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return true;
  }
}
