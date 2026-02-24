import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const mode = args.find((arg) => !arg.startsWith("--")) ?? "all";

function collectTestFiles(rootDir) {
  const result = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || !fs.existsSync(current)) {
      continue;
    }

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && fullPath.endsWith(".test.ts")) {
        result.push(fullPath);
      }
    }
  }

  return result.sort((left, right) => left.localeCompare(right));
}

function runCommand(command, commandArgs, env) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(command, commandArgs, { env, stdio: ["ignore", "pipe", "pipe"] });

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} ${commandArgs.join(" ")} failed (${code})\n${stdout}\n${stderr}`));
      }
    });
  });
}

async function runTestFile(filePath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "open-ios-doodler-test-"));
  const sqliteDbPath = path.join(tmpDir, "test.sqlite");
  const env = {
    ...process.env,
    DATABASE_URL: `file:${sqliteDbPath}`,
    SQLITE_DB_PATH: sqliteDbPath,
    NODE_ENV: "test",
    PRISMA_HIDE_UPDATE_MESSAGE: "1",
  };

  try {
    await runCommand("npx", ["prisma", "db", "push", "--accept-data-loss"], env);
    await runCommand("npx", ["tsx", "--test", filePath], env);
  } finally {
    fs.rmSync(tmpDir, { force: true, recursive: true });
  }
}

async function main() {
  const rootDir = process.cwd();
  const files = collectTestFiles(path.join(rootDir, "tests"));

  if (files.length < 1) {
    console.error("No test files found.");
    process.exit(1);
  }

  const selected = mode === "lib" ? files.filter((item) => item.includes("/lib/")) : files;
  const effective = selected.length > 0 ? selected : files;
  let failCount = 0;

  for (const file of effective) {
    try {
      await runTestFile(file);
      console.log(`[ok] ${path.relative(rootDir, file)}`);
    } catch (error) {
      failCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      const firstLine = message.split("\n")[0];
      console.log(`[fail] ${path.relative(rootDir, file)} (${firstLine})`);
    }
  }

  console.log(`\nTest summary: ${effective.length - failCount} passed, ${failCount} failed`);
  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
