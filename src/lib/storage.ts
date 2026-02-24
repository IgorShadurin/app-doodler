import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const PUBLIC_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "templates");

function extFromFilename(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }
  return ".png";
}

export type SavedTemplateImage = {
  publicPath: string;
  width: number;
  height: number;
};

export async function saveTemplateUpload(file: File): Promise<SavedTemplateImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Uploaded file must be an image.");
  }

  const original = Buffer.from(await file.arrayBuffer());
  const image = sharp(original, { failOn: "error" }).rotate();
  const metadata = await image.metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width < 1 || height < 1) {
    throw new Error("Unable to read image dimensions.");
  }

  await fs.mkdir(PUBLIC_UPLOAD_ROOT, { recursive: true });

  const ext = extFromFilename(file.name);
  const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${baseName}${ext}`;
  const absolutePath = path.join(PUBLIC_UPLOAD_ROOT, fileName);

  if (ext === ".png") {
    await image.png().toFile(absolutePath);
  } else if (ext === ".webp") {
    await image.webp({ quality: 96 }).toFile(absolutePath);
  } else {
    await image.jpeg({ quality: 96 }).toFile(absolutePath);
  }

  return {
    publicPath: `/uploads/templates/${fileName}`,
    width,
    height,
  };
}

export function resolvePublicAssetPath(publicPath: string): string {
  if (!publicPath.startsWith("/")) {
    throw new Error("publicPath must start with '/'.");
  }

  return path.join(process.cwd(), "public", publicPath);
}
