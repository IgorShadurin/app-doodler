import assert from "node:assert/strict";
import path from "node:path";

const DEV_DB_PATH = path.resolve(process.cwd(), "prisma/dev.db");

export function assertTestDatabaseGuard(): void {
  const sqliteDbPath = process.env.SQLITE_DB_PATH;
  const databaseUrl = process.env.DATABASE_URL;

  assert.ok(sqliteDbPath, "SQLITE_DB_PATH is required for tests.");
  assert.ok(databaseUrl, "DATABASE_URL is required for tests.");
  assert.equal(databaseUrl, `file:${sqliteDbPath}`, "DATABASE_URL must match SQLITE_DB_PATH");

  const resolvedSqliteDbPath = path.resolve(sqliteDbPath);
  assert.notEqual(resolvedSqliteDbPath, DEV_DB_PATH, "Tests must not use dev sqlite db.");
}
