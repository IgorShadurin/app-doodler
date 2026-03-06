import { assertTestDatabaseGuard } from "../helpers/test-db";

assertTestDatabaseGuard();

import assert from "node:assert/strict";
import test from "node:test";

import { STUDIO_LANGUAGES } from "@/features/app-doodler/languages";
import { createInitialSlots } from "@/features/app-doodler/model";
import {
  clonePersistedStudioState,
  parseProjectFileJson,
  PROJECT_FILE_FORMAT,
  PROJECT_FILE_VERSION,
  serializeProjectFile,
  type PersistedStudioState,
} from "@/features/app-doodler/project-file";
import {
  canRedoProjectHistory,
  canUndoProjectHistory,
  createProjectHistory,
  projectHistoryPush,
  projectHistoryRedo,
  projectHistoryUndo,
} from "@/features/app-doodler/project-history";

function createState(seed = 0): PersistedStudioState {
  const slots = createInitialSlots(STUDIO_LANGUAGES);
  if (slots[0]) {
    slots[0].textByLanguage["en-US"] = {
      ...(slots[0].textByLanguage["en-US"] ?? {}),
      headline: `Headline ${seed}`,
    };
  }

  return {
    slots,
    enabledLanguages: ["en-US", "nl-NL"],
    activeLanguageCode: "nl-NL",
    favoriteFonts: seed % 2 === 0 ? ["Arial"] : ["Helvetica"],
  };
}

test("serializeProjectFile + parseProjectFileJson roundtrip state", () => {
  const state = createState(1);
  const content = serializeProjectFile(state, { projectName: "Demo project", savedAtIso: "2026-01-02T03:04:05.000Z" });

  const parsed = parseProjectFileJson(content);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  assert.equal(parsed.value.format, PROJECT_FILE_FORMAT);
  assert.equal(parsed.value.version, PROJECT_FILE_VERSION);
  assert.equal(parsed.value.projectName, "Demo project");
  assert.equal(parsed.value.savedAt, "2026-01-02T03:04:05.000Z");
  assert.deepEqual(parsed.value.state, state);
});

test("parseProjectFileJson rejects malformed payload", () => {
  const invalidJson = parseProjectFileJson("{");
  assert.equal(invalidJson.ok, false);

  const wrongRoot = parseProjectFileJson(JSON.stringify({ format: PROJECT_FILE_FORMAT }));
  assert.equal(wrongRoot.ok, false);

  const wrongVersion = parseProjectFileJson(JSON.stringify({
    format: PROJECT_FILE_FORMAT,
    version: 999,
    savedAt: new Date().toISOString(),
    state: createState(2),
  }));
  assert.equal(wrongVersion.ok, false);
});

test("clonePersistedStudioState returns deep clone", () => {
  const original = createState(3);
  const copy = clonePersistedStudioState(original);

  assert.deepEqual(copy, original);
  assert.notEqual(copy, original);
  assert.notEqual(copy.slots, original.slots);

  if (copy.slots[0]) {
    copy.slots[0].labels = [];
  }
  assert.notDeepEqual(copy, original);
});

test("project history push/undo/redo supports capacity and resets redo stack", () => {
  const initial = createState(10);
  let history = createProjectHistory(initial, { capacity: 2 });
  assert.equal(canUndoProjectHistory(history), false);
  assert.equal(canRedoProjectHistory(history), false);

  const step1 = createState(11);
  const step2 = createState(12);
  const step3 = createState(13);

  history = projectHistoryPush(history, step1);
  history = projectHistoryPush(history, step2);
  history = projectHistoryPush(history, step3);

  assert.equal(history.past.length, 2);
  assert.equal(canUndoProjectHistory(history), true);

  const undo1 = projectHistoryUndo(history);
  assert.equal(undo1.ok, true);
  if (!undo1.ok) return;
  history = undo1.value;
  assert.deepEqual(history.present, step2);
  assert.equal(canRedoProjectHistory(history), true);

  const undo2 = projectHistoryUndo(history);
  assert.equal(undo2.ok, true);
  if (!undo2.ok) return;
  history = undo2.value;
  assert.deepEqual(history.present, step1);

  const redo1 = projectHistoryRedo(history);
  assert.equal(redo1.ok, true);
  if (!redo1.ok) return;
  history = redo1.value;
  assert.deepEqual(history.present, step2);

  history = projectHistoryPush(history, createState(14));
  assert.equal(canRedoProjectHistory(history), false);
});
