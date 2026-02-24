import assert from "node:assert/strict";
import test from "node:test";

import { applyDragDelta, normalizeLabelDraft } from "@/lib/labels";

test("normalizeLabelDraft clamps values into valid ranges", () => {
  const normalized = normalizeLabelDraft({
    key: "hero",
    x: -0.2,
    y: 2,
    width: 5,
    fontSize: -1,
    color: "#FFF",
    align: "center",
    fontWeight: 1200,
    maxLines: 12,
  });

  assert.equal(normalized.x, 0);
  assert.equal(normalized.y, 1);
  assert.equal(normalized.width, 1);
  assert.equal(normalized.fontSize, 0.01);
  assert.equal(normalized.fontWeight, 900);
  assert.equal(normalized.maxLines, 6);
});

test("applyDragDelta updates normalized coordinates from pixel drag", () => {
  const next = applyDragDelta(
    { x: 0.1, y: 0.2 },
    { deltaX: 80, deltaY: -40, canvasWidth: 400, canvasHeight: 800 },
  );

  assert.equal(next.x, 0.3);
  assert.equal(next.y, 0.15);
});

test("applyDragDelta clamps coordinates on bounds", () => {
  const next = applyDragDelta(
    { x: 0.95, y: 0.1 },
    { deltaX: 50, deltaY: 1000, canvasWidth: 100, canvasHeight: 500 },
  );

  assert.equal(next.x, 1);
  assert.equal(next.y, 1);
});
