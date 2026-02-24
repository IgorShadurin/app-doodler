import fs from "node:fs/promises";
import path from "node:path";

import { sanitizeSegment } from "@/lib/exporter";

export type GeneratedArtifact = {
  languageCode: string;
  templateName: string;
  fileName: string;
  data: Buffer;
};

function toSafeFolder(value: string, fallback: string): string {
  return sanitizeSegment(value) || fallback;
}

export function resolveOutputDirectoryPath(outputDir: string): string {
  const clean = outputDir.trim();
  if (!clean) {
    throw new Error("outputDir is required.");
  }

  return path.isAbsolute(clean) ? clean : path.resolve(process.cwd(), clean);
}

export function buildLanguageGroupedOutputPath(
  outputDir: string,
  languageCode: string,
  templateName: string,
  fileName: string,
): string {
  const safeLanguage = toSafeFolder(languageCode, "lang");
  const safeTemplate = toSafeFolder(templateName, "template");
  return path.join(outputDir, safeLanguage, safeTemplate, fileName);
}

export async function writeArtifactsGroupedByLanguage(
  outputDir: string,
  artifacts: GeneratedArtifact[],
): Promise<string[]> {
  const writtenPaths: string[] = [];

  for (const artifact of artifacts) {
    const filePath = buildLanguageGroupedOutputPath(
      outputDir,
      artifact.languageCode,
      artifact.templateName,
      artifact.fileName,
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, artifact.data);
    writtenPaths.push(filePath);
  }

  return writtenPaths;
}
