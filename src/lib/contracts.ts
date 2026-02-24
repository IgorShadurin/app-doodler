export type TemplateLabelDto = {
  id: string;
  key: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: "left" | "center" | "right";
  maxLines: number;
};

export type TranslationDto = {
  id: string;
  languageCode: string;
  entries: Record<string, string>;
};

export type TemplateDto = {
  id: string;
  name: string;
  description: string | null;
  sourceImagePath: string;
  sourceWidth: number;
  sourceHeight: number;
  labels: TemplateLabelDto[];
  translations: TranslationDto[];
  updatedAt: string;
};
