import JSZip from "jszip";

export type ZipFileInput = {
  name: string;
  data: Buffer;
};

export function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildOutputFilename(templateName: string, presetId: string, languageCode: string): string {
  const safeTemplate = sanitizeSegment(templateName) || "template";
  const safePreset = sanitizeSegment(presetId) || "preset";
  const safeLanguage = sanitizeSegment(languageCode) || "lang";
  return `${safeTemplate}_${safePreset}_${safeLanguage}.png`;
}

export async function createZipBuffer(files: ZipFileInput[]): Promise<Buffer> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.data);
  }

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });
}
