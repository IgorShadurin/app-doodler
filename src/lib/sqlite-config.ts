import path from "node:path";

export type SqliteConfig = {
  databaseUrl: string;
  sqliteFilePath: string;
};

const SQLITE_URL_PREFIX = "file:";
const DEFAULT_SQLITE_DATABASE_URL = "file:./prisma/dev.db";

function isSqliteFileUrl(value: string | undefined): value is string {
  return typeof value === "string" && value.startsWith(SQLITE_URL_PREFIX);
}

export function resolveSqliteConfig(): SqliteConfig {
  const sqliteDatabaseUrl = process.env.SQLITE_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const resolvedDatabaseUrl = isSqliteFileUrl(sqliteDatabaseUrl)
    ? sqliteDatabaseUrl
    : isSqliteFileUrl(databaseUrl)
      ? databaseUrl
      : DEFAULT_SQLITE_DATABASE_URL;

  const filePart = resolvedDatabaseUrl.slice(SQLITE_URL_PREFIX.length);
  const sqliteFilePath = path.isAbsolute(filePart)
    ? filePart
    : path.resolve(process.cwd(), filePart);

  return {
    databaseUrl: resolvedDatabaseUrl,
    sqliteFilePath,
  };
}
