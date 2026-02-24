import assert from "node:assert/strict";
import test from "node:test";

import JSZip from "jszip";

import { buildOutputFilename, createZipBuffer } from "@/lib/exporter";

test("buildOutputFilename sanitizes unsafe characters", () => {
  const name = buildOutputFilename("My Template!*", "iphone-6-7", "pt-BR");
  assert.equal(name, "my-template_iphone-6-7_pt-br.png");
});

test("createZipBuffer packs files with expected names", async () => {
  const buffer = await createZipBuffer([
    { name: "a.txt", data: Buffer.from("A") },
    { name: "b.txt", data: Buffer.from("B") },
  ]);

  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files).sort();
  assert.deepEqual(names, ["a.txt", "b.txt"]);
});
