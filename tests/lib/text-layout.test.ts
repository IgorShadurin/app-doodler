import assert from "node:assert/strict";
import test from "node:test";

import { wrapTextToLines } from "@/lib/text-layout";

test("wrapTextToLines keeps short text on one line", () => {
  const lines = wrapTextToLines({
    text: "Hello world",
    maxWidthPx: 600,
    fontSizePx: 40,
    maxLines: 3,
  });

  assert.deepEqual(lines, ["Hello world"]);
});

test("wrapTextToLines wraps long text and respects maxLines", () => {
  const lines = wrapTextToLines({
    text: "This is a very long sentence that should wrap across multiple lines",
    maxWidthPx: 180,
    fontSizePx: 30,
    maxLines: 2,
  });

  assert.equal(lines.length, 2);
  assert.ok(lines[1]?.endsWith("..."));
});

test("wrapTextToLines handles CJK text with no spaces", () => {
  const lines = wrapTextToLines({
    text: "這是一個很長很長的中文句子用於測試換行能力",
    maxWidthPx: 120,
    fontSizePx: 24,
    maxLines: 3,
  });

  assert.ok(lines.length > 1);
});
