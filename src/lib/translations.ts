export type ParsedLanguageTranslations = {
  languageCode: string;
  entries: Record<string, string>;
};

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

export function parseTranslationJson(input: string): ParsedLanguageTranslations[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON payload.");
  }

  if (!isRecord(parsed)) {
    throw new Error("Expected a top-level JSON object keyed by language codes.");
  }

  const languages: ParsedLanguageTranslations[] = [];

  for (const [rawLanguageCode, value] of Object.entries(parsed)) {
    if (!isRecord(value)) {
      throw new Error(`Language '${rawLanguageCode}' must be an object of label/text pairs.`);
    }

    const languageCode = rawLanguageCode.trim();
    if (!languageCode) {
      throw new Error("Language code cannot be empty.");
    }

    const entries: Record<string, string> = {};

    for (const [rawLabel, textValue] of Object.entries(value)) {
      const label = rawLabel.trim();
      if (!label) {
        throw new Error(`Language '${languageCode}' contains an empty label key.`);
      }
      if (typeof textValue !== "string") {
        throw new Error(`Language '${languageCode}' label '${label}' must be a string.`);
      }

      entries[label] = textValue.trim();
    }

    languages.push({ languageCode, entries });
  }

  if (languages.length === 0) {
    throw new Error("At least one language is required.");
  }

  return languages.sort((left, right) => left.languageCode.localeCompare(right.languageCode));
}

export function parseEntriesJson(entriesJson: string): Record<string, string> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(entriesJson);
  } catch {
    return {};
  }

  if (!isRecord(parsed)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }

  return result;
}
