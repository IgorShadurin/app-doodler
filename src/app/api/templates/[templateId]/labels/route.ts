import { NextResponse } from "next/server";

import type { LabelDraft } from "@/lib/labels";
import { getTemplateWithRelations, replaceLabelsForTemplate } from "@/lib/template-service";
import { toTemplateDto } from "@/lib/template-dto";

export const runtime = "nodejs";

function isValidAlign(value: string): value is LabelDraft["align"] {
  return value === "left" || value === "center" || value === "right";
}

function parseLabelList(payload: unknown): LabelDraft[] {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload.");
  }

  const labels = (payload as { labels?: unknown }).labels;
  if (!Array.isArray(labels)) {
    throw new Error("labels must be an array.");
  }

  return labels.map((raw, index) => {
    if (!raw || typeof raw !== "object") {
      throw new Error(`labels[${index}] must be an object.`);
    }

    const label = raw as Record<string, unknown>;
    if (typeof label.key !== "string" || !label.key.trim()) {
      throw new Error(`labels[${index}].key is required.`);
    }
    if (typeof label.color !== "string") {
      throw new Error(`labels[${index}].color must be string.`);
    }
    if (typeof label.align !== "string" || !isValidAlign(label.align)) {
      throw new Error(`labels[${index}].align must be left|center|right.`);
    }

    return {
      key: label.key.trim(),
      x: Number(label.x),
      y: Number(label.y),
      width: Number(label.width),
      fontSize: Number(label.fontSize),
      fontWeight: Number(label.fontWeight),
      color: label.color,
      align: label.align,
      maxLines: Number(label.maxLines),
    };
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await context.params;
  const template = await getTemplateWithRelations(templateId);

  if (!template) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const labels = parseLabelList(payload);
    const updated = await replaceLabelsForTemplate(templateId, labels);

    if (!updated) {
      return NextResponse.json({ error: "Template not found." }, { status: 404 });
    }

    return NextResponse.json(toTemplateDto(updated));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save labels.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
