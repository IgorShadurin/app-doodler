import { NextResponse } from "next/server";

import { getTemplateWithRelations } from "@/lib/template-service";
import { toTemplateDto } from "@/lib/template-dto";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await context.params;
  const template = await getTemplateWithRelations(templateId);

  if (!template) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json(toTemplateDto(template));
}
