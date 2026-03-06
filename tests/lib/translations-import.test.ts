import { assertTestDatabaseGuard } from "../helpers/test-db";

assertTestDatabaseGuard();

import assert from "node:assert/strict";
import test from "node:test";

import { createEmptySlot } from "@/features/app-doodler/model";
import {
  applyTranslationsImport,
  parseTranslationsImportJson,
} from "@/features/app-doodler/translations-import";

test("parseTranslationsImportJson parses direct language map", () => {
  const input = JSON.stringify({
    "en-US": { headline: "Hello", subtitle: "World" },
    ru: { headline: "Привет", subtitle: "Мир" },
    "es-ES": { headline: "Hola", subtitle: "Mundo" },
  });

  const parsed = parseTranslationsImportJson(input);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.languageCount, 3);
  assert.equal(parsed.value.keysPerLanguage, 2);
  assert.equal(parsed.value.pairCount, 6);
});

test("parseTranslationsImportJson rejects legacy slots/translations envelope", () => {
  const parsed = parseTranslationsImportJson(JSON.stringify({
    translations: {
      "en-US": { headline: "Global title" },
    },
    slots: {
      2: {
        "en-US": { subtitle: "Slot two text" },
      },
    },
  }));
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.match(parsed.error, /direct language-map format/i);
});

test("parseTranslationsImportJson returns human readable validation errors", () => {
  const invalidJson = parseTranslationsImportJson("{");
  assert.equal(invalidJson.ok, false);
  if (invalidJson.ok) return;
  assert.match(invalidJson.error, /valid JSON/i);

  const invalidShape = parseTranslationsImportJson(JSON.stringify({ "en-US": "wrong" }));
  assert.equal(invalidShape.ok, false);
  if (invalidShape.ok) return;
  assert.match(invalidShape.error, /must be an object/i);
});

test("parseTranslationsImportJson rejects different key sets across languages", () => {
  const parsed = parseTranslationsImportJson(JSON.stringify({
    "en-US": {
      headline: "Title",
      subtitle: "Copy",
    },
    ru: {
      headline: "Заголовок",
      cta: "Кнопка",
    },
  }));

  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.match(parsed.error, /same label keys/i);
});

test("applyTranslationsImport applies imported text map to all slots", () => {
  const slots = [createEmptySlot(1), createEmptySlot(2)];
  const parsed = parseTranslationsImportJson(JSON.stringify({
    "en-US": {
      headline: "Global headline",
      subtitle: "Global subtitle",
    },
    ru: {
      headline: "Общий заголовок",
      subtitle: "Общий подзаголовок",
    },
  }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  const result = applyTranslationsImport(slots, parsed.value);
  assert.equal(result.appliedPairCount, parsed.value.pairCount * slots.length);
  assert.equal(result.slots[0]?.textByLanguage["en-US"]?.headline, "Global headline");
  assert.equal(result.slots[1]?.textByLanguage["en-US"]?.subtitle, "Global subtitle");
  assert.equal(result.slots[1]?.textByLanguage.ru?.headline, "Общий заголовок");
});
