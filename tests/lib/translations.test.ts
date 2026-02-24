import assert from "node:assert/strict";
import test from "node:test";

import { parseTranslationJson } from "@/lib/translations";

test("parseTranslationJson parses language map payload", () => {
  const payload = JSON.stringify({
    en: { title: "Hello", subtitle: "World" },
    fr: { title: "Bonjour", subtitle: "Monde" },
  });

  const parsed = parseTranslationJson(payload);

  assert.equal(parsed.length, 2);
  assert.equal(parsed[0]?.languageCode, "en");
  assert.equal(parsed[1]?.entries.subtitle, "Monde");
});

test("parseTranslationJson trims language code and string values", () => {
  const payload = JSON.stringify({
    " en ": { title: "  Hello  " },
  });

  const parsed = parseTranslationJson(payload);
  assert.equal(parsed[0]?.languageCode, "en");
  assert.equal(parsed[0]?.entries.title, "Hello");
});

test("parseTranslationJson rejects invalid structures", () => {
  assert.throws(() => parseTranslationJson("[]"), /top-level JSON object/i);
  assert.throws(() => parseTranslationJson("{\"en\": []}"), /must be an object of label\/text pairs/i);
  assert.throws(() => parseTranslationJson("{\"en\": {\"title\": 42}}"), /must be a string/i);
});
