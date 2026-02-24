import { assertTestDatabaseGuard } from "../helpers/test-db";

assertTestDatabaseGuard();

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";

import { renderImage } from "@/lib/image-generator";

test("renderImage outputs png with target dimensions", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "open-ios-doodler-image-test-"));
  const sourcePath = path.join(tmpDir, "source.png");

  try {
    await sharp({
      create: {
        width: 600,
        height: 1200,
        channels: 4,
        background: { r: 20, g: 20, b: 20, alpha: 1 },
      },
    })
      .png()
      .toFile(sourcePath);

    const output = await renderImage({
      templatePath: sourcePath,
      outputWidth: 1290,
      outputHeight: 2796,
      labels: [
        {
          key: "title",
          x: 0.1,
          y: 0.1,
          width: 0.8,
          fontSize: 0.05,
          fontWeight: 700,
          color: "#ffffff",
          align: "center",
          maxLines: 2,
        },
      ],
      translations: {
        title: "Hello from Open iOS Doodler",
      },
    });

    const metadata = await sharp(output).metadata();

    assert.equal(metadata.width, 1290);
    assert.equal(metadata.height, 2796);
    assert.equal(metadata.format, "png");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
