import { NextResponse } from "next/server";

import { getTemplateWithRelations, importTranslationsForTemplate } from "@/lib/template-service";
import { toTemplateDto } from "@/lib/template-dto";
import { parseTranslationJson } from "@/lib/translations";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  context: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await context.params;
  const existing = await getTemplateWithRelations(templateId);

  if (!existing) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const jsonText = typeof payload?.json === "string"
      ? payload.json
      : JSON.stringify(payload?.translations ?? {});

    const parsed = parseTranslationJson(jsonText);
    const map = Object.fromEntries(parsed.map((item) => [item.languageCode, item.entries]));

    const updatedCount = await importTranslationsForTemplate(templateId, map);
    const updated = await getTemplateWithRelations(templateId);

    return NextResponse.json({
      updatedCount,
      template: updated ? toTemplateDto(updated) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import translations.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
