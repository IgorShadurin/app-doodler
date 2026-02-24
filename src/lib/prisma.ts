import fs from "node:fs";
import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

import { resolveSqliteConfig } from "@/lib/sqlite-config";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const sqliteConfig = resolveSqliteConfig();
fs.mkdirSync(path.dirname(sqliteConfig.sqliteFilePath), { recursive: true });
const sqliteAdapter = new PrismaBetterSqlite3({ url: sqliteConfig.databaseUrl });

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    adapter: sqliteAdapter,
    log: process.env.NODE_ENV === "test" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
