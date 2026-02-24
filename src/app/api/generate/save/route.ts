import { NextResponse } from "next/server";

import { generateArtifactsForTemplate } from "@/lib/generation-service";
import {
  resolveOutputDirectoryPath,
  writeArtifactsGroupedByLanguage,
} from "@/lib/output-writer";
import {
  getTemplatesWithRelationsByIds,
  listTemplatesWithRelations,
} from "@/lib/template-service";

export const runtime = "nodejs";

type SaveGeneratePayload = {
  templateIds?: string[];
  allTemplates?: boolean;
  presetIds?: string[];
  languageCodes?: string[];
  allLanguages?: boolean;
  outputDir?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveGeneratePayload;
  const presetIds = Array.isArray(payload.presetIds) ? payload.presetIds : [];

  if (presetIds.length < 1) {
    return NextResponse.json({ error: "Select at least one iOS size preset." }, { status: 400 });
  }

  if (typeof payload.outputDir !== "string" || payload.outputDir.trim().length < 1) {
    return NextResponse.json({ error: "outputDir is required." }, { status: 400 });
  }

  const templates = payload.allTemplates
    ? await listTemplatesWithRelations()
    : await getTemplatesWithRelationsByIds(payload.templateIds ?? []);

  if (templates.length < 1) {
    return NextResponse.json({ error: "No templates selected." }, { status: 400 });
  }

  const artifacts = [];

  for (const template of templates) {
    const generated = await generateArtifactsForTemplate(template, {
      presetIds,
      allLanguages: payload.allLanguages === true,
      languageCodes: payload.languageCodes,
    });

    artifacts.push(...generated);
  }

  if (artifacts.length < 1) {
    return NextResponse.json({ error: "No files were generated. Check selected languages." }, { status: 400 });
  }

  try {
    const resolvedOutputDir = resolveOutputDirectoryPath(payload.outputDir);
    const writtenPaths = await writeArtifactsGroupedByLanguage(resolvedOutputDir, artifacts);
    const languageCodes = Array.from(new Set(artifacts.map((item) => item.languageCode))).sort();

    return NextResponse.json({
      outputDir: resolvedOutputDir,
      writtenCount: writtenPaths.length,
      languageCodes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to write generated files.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
