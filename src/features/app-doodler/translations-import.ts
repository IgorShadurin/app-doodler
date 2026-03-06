import type { TemplateSlot } from "@/features/app-doodler/model";

type LanguageTextEntries = Record<string, string>;

export type LanguageTextMap = Record<string, LanguageTextEntries>;

export type ParsedTranslationsImport = {
  translations: LanguageTextMap;
  languageCount: number;
  keysPerLanguage: number;
  pairCount: number;
};

export type ParseTranslationsImportResult =
  | { ok: true; value: ParsedTranslationsImport }
  | { ok: false; error: string };

export type ApplyTranslationsImportResult = {
  slots: TemplateSlot[];
  appliedPairCount: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseTranslationsImportJson(jsonText: string): ParseTranslationsImportResult {
  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(jsonText);
  } catch {
    return {
      ok: false,
      error: "JSON is invalid. Please provide a valid JSON file.",
    };
  }

  if (!isRecord(parsedValue)) {
    return {
      ok: false,
      error: "Root JSON must be an object.",
    };
  }

  if ("translations" in parsedValue || "slots" in parsedValue) {
    return {
      ok: false,
      error:
        "Only direct language-map format is supported now. Do not use `translations` or `slots` keys.",
    };
  }

  const next: LanguageTextMap = {};
  let languageCount = 0;
  let keysPerLanguage = 0;
  let pairCount = 0;
  let referenceKeys: string[] | null = null;
  let referenceLanguage = "";

  for (const [languageCode, languageValue] of Object.entries(parsedValue)) {
    if (!languageCode.trim()) {
      return { ok: false, error: "JSON has an empty language code key." };
    }
    if (!isRecord(languageValue)) {
      return {
        ok: false,
        error: `${languageCode} must be an object of label keys and string values.`,
      };
    }

    const labels: Record<string, string> = {};
    for (const [labelKey, labelValue] of Object.entries(languageValue)) {
      if (!labelKey.trim()) {
        return {
          ok: false,
          error: `${languageCode} has an empty label key.`,
        };
      }
      if (typeof labelValue !== "string") {
        return {
          ok: false,
          error: `${languageCode}.${labelKey} must be a string.`,
        };
      }
      labels[labelKey] = labelValue;
    }

    const currentKeys = Object.keys(labels).sort();
    if (currentKeys.length < 1) {
      return {
        ok: false,
        error: `${languageCode} must contain at least one label key.`,
      };
    }

    if (!referenceKeys) {
      referenceKeys = currentKeys;
      referenceLanguage = languageCode;
      keysPerLanguage = currentKeys.length;
    } else {
      const sameCount = currentKeys.length === referenceKeys.length;
      const sameNames = sameCount && currentKeys.every((key, index) => key === referenceKeys?.[index]);
      if (!sameNames) {
        return {
          ok: false,
          error: `All languages must contain the same label keys. ${languageCode} keys differ from ${referenceLanguage}.`,
        };
      }
    }

    next[languageCode] = labels;
    languageCount += 1;
  }

  if (languageCount < 1) {
    return {
      ok: false,
      error: "JSON must contain at least one language.",
    };
  }
  if (keysPerLanguage < 1) {
    return {
      ok: false,
      error: "JSON must contain at least one label key per language.",
    };
  }

  pairCount = languageCount * keysPerLanguage;

  return {
    ok: true,
    value: {
      translations: next,
      languageCount,
      keysPerLanguage,
      pairCount,
    },
  };
}

function mergeLanguageTextMap(existing: Record<string, Record<string, string>>, incoming: LanguageTextMap) {
  const next = { ...existing };
  for (const [languageCode, labels] of Object.entries(incoming)) {
    next[languageCode] = {
      ...(next[languageCode] ?? {}),
      ...labels,
    };
  }
  return next;
}

export function applyTranslationsImport(
  slots: TemplateSlot[],
  imported: ParsedTranslationsImport,
): ApplyTranslationsImportResult {
  const nextSlots = slots.map((slot) => ({
    ...slot,
    textByLanguage: mergeLanguageTextMap(slot.textByLanguage, imported.translations),
  }));

  return {
    slots: nextSlots,
    appliedPairCount: imported.pairCount * slots.length,
  };
}
