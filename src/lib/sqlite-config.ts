import path from "node:path";

export type SqliteConfig = {
  databaseUrl: string;
  sqliteFilePath: string;
};

export function resolveSqliteConfig(): SqliteConfig {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl?.startsWith("file:")) {
    throw new Error("DATABASE_URL must use sqlite file: URL format (for example: file:./prisma/dev.db)");
  }

  const filePart = databaseUrl.slice("file:".length);
  const sqliteFilePath = path.isAbsolute(filePart)
    ? filePart
    : path.resolve(process.cwd(), filePart);

  return {
    databaseUrl,
    sqliteFilePath,
  };
}
