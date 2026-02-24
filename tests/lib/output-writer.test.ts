import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { buildLanguageGroupedOutputPath, writeArtifactsGroupedByLanguage } from "@/lib/output-writer";

test("buildLanguageGroupedOutputPath groups by language and template", () => {
  const output = buildLanguageGroupedOutputPath("/tmp/out", "pt-BR", "Main Hero", "main-hero_iphone-6-7_pt-br.png");
  assert.equal(output, path.join("/tmp/out", "pt-br", "main-hero", "main-hero_iphone-6-7_pt-br.png"));
});

test("writeArtifactsGroupedByLanguage writes image buffers to grouped folders", async () => {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "open-ios-doodler-writer-"));

  try {
    const result = await writeArtifactsGroupedByLanguage(baseDir, [
      {
        languageCode: "en",
        templateName: "Feature One",
        fileName: "feature-one_iphone-6-7_en.png",
        data: Buffer.from("A"),
      },
      {
        languageCode: "de",
        templateName: "Feature One",
        fileName: "feature-one_iphone-6-7_de.png",
        data: Buffer.from("B"),
      },
    ]);

    assert.equal(result.length, 2);

    const firstPath = path.join(baseDir, "en", "feature-one", "feature-one_iphone-6-7_en.png");
    const secondPath = path.join(baseDir, "de", "feature-one", "feature-one_iphone-6-7_de.png");

    assert.equal(fs.existsSync(firstPath), true);
    assert.equal(fs.existsSync(secondPath), true);
  } finally {
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
});
