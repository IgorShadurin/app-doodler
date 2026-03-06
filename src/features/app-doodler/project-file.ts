import type { TemplateAsset, TemplateLabel, TemplateSlot } from '@/features/app-doodler/model';
import type { AppDoodlerPersistedState } from '@/features/app-doodler/browser-db';

export const PROJECT_FILE_FORMAT = 'app-doodler-project';
export const PROJECT_FILE_VERSION = 1;
export const PROJECT_FILE_EXTENSION = '.doodler';

export type PersistedStudioState = AppDoodlerPersistedState;

export type DoodlerProjectFile = {
  format: typeof PROJECT_FILE_FORMAT;
  version: typeof PROJECT_FILE_VERSION;
  savedAt: string;
  projectName?: string;
  state: PersistedStudioState;
};

export type ParseProjectFileResult =
  | { ok: true; value: DoodlerProjectFile }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function cloneTemplateAsset(asset: TemplateAsset): TemplateAsset {
  return { ...asset };
}

function cloneTemplateLabel(label: TemplateLabel): TemplateLabel {
  return { ...label };
}

function cloneTemplateSlot(slot: TemplateSlot): TemplateSlot {
  return {
    ...slot,
    baseAsset: slot.baseAsset ? cloneTemplateAsset(slot.baseAsset) : null,
    languageOverrides: Object.fromEntries(
      Object.entries(slot.languageOverrides).map(([languageCode, asset]) => [
        languageCode,
        cloneTemplateAsset(asset),
      ]),
    ),
    labels: slot.labels.map((label) => cloneTemplateLabel(label)),
    textByLanguage: Object.fromEntries(
      Object.entries(slot.textByLanguage).map(([languageCode, values]) => [
        languageCode,
        { ...values },
      ]),
    ),
  };
}

export function clonePersistedStudioState(state: PersistedStudioState): PersistedStudioState {
  return {
    slots: state.slots.map((slot) => cloneTemplateSlot(slot)),
    enabledLanguages: [...state.enabledLanguages],
    activeLanguageCode: state.activeLanguageCode,
    favoriteFonts: [...state.favoriteFonts],
  };
}

function isTemplateAsset(value: unknown): value is TemplateAsset {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string'
    && typeof value.src === 'string'
    && typeof value.width === 'number'
    && Number.isFinite(value.width)
    && typeof value.height === 'number'
    && Number.isFinite(value.height)
    && typeof value.mimeType === 'string'
    && typeof value.fileName === 'string'
  );
}

function isLabelAlign(value: unknown): value is 'left' | 'center' | 'right' {
  return value === 'left' || value === 'center' || value === 'right';
}

function isLabelVerticalAlign(value: unknown): value is 'top' | 'center' | 'bottom' {
  return value === 'top' || value === 'center' || value === 'bottom';
}

function isLabelTextCase(value: unknown): value is 'default' | 'uppercase' | 'lowercase' {
  return value === 'default' || value === 'uppercase' || value === 'lowercase';
}

function isTemplateLabel(value: unknown): value is TemplateLabel {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string'
    && typeof value.key === 'string'
    && typeof value.x === 'number'
    && Number.isFinite(value.x)
    && typeof value.y === 'number'
    && Number.isFinite(value.y)
    && typeof value.width === 'number'
    && Number.isFinite(value.width)
    && typeof value.height === 'number'
    && Number.isFinite(value.height)
    && typeof value.fontSize === 'number'
    && Number.isFinite(value.fontSize)
    && typeof value.fontFamily === 'string'
    && typeof value.fontWeight === 'number'
    && Number.isFinite(value.fontWeight)
    && typeof value.rotation === 'number'
    && Number.isFinite(value.rotation)
    && typeof value.color === 'string'
    && typeof value.maxLines === 'number'
    && Number.isFinite(value.maxLines)
    && isLabelAlign(value.align)
    && isLabelVerticalAlign(value.verticalAlign)
    && isLabelTextCase(value.textCase)
  );
}

function isLanguageTextMap(value: unknown): value is Record<string, Record<string, string>> {
  if (!isRecord(value)) return false;
  for (const [languageCode, entries] of Object.entries(value)) {
    if (!languageCode.trim() || !isRecord(entries)) return false;
    for (const [labelKey, text] of Object.entries(entries)) {
      if (!labelKey.trim() || typeof text !== 'string') return false;
    }
  }
  return true;
}

function isTemplateSlot(value: unknown): value is TemplateSlot {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'string' || typeof value.order !== 'number' || !Number.isFinite(value.order)) {
    return false;
  }

  if (!(value.baseAsset === null || isTemplateAsset(value.baseAsset))) {
    return false;
  }

  if (!isRecord(value.languageOverrides)) return false;
  for (const [languageCode, asset] of Object.entries(value.languageOverrides)) {
    if (!languageCode.trim() || !isTemplateAsset(asset)) return false;
  }

  if (!Array.isArray(value.labels) || !value.labels.every((label) => isTemplateLabel(label))) {
    return false;
  }

  if (!isLanguageTextMap(value.textByLanguage)) return false;

  return true;
}

function parsePersistedStudioState(value: unknown): PersistedStudioState | null {
  if (!isRecord(value)) return null;
  if (!Array.isArray(value.slots) || !value.slots.every((slot) => isTemplateSlot(slot))) return null;
  if (!isStringArray(value.enabledLanguages)) return null;
  if (typeof value.activeLanguageCode !== 'string') return null;
  if (!isStringArray(value.favoriteFonts)) return null;

  return clonePersistedStudioState({
    slots: value.slots,
    enabledLanguages: value.enabledLanguages,
    activeLanguageCode: value.activeLanguageCode,
    favoriteFonts: value.favoriteFonts,
  });
}

export function serializeProjectFile(
  state: PersistedStudioState,
  options?: { projectName?: string; savedAtIso?: string },
): string {
  const normalizedName = options?.projectName?.trim();
  const document: DoodlerProjectFile = {
    format: PROJECT_FILE_FORMAT,
    version: PROJECT_FILE_VERSION,
    savedAt: options?.savedAtIso ?? new Date().toISOString(),
    state: clonePersistedStudioState(state),
    ...(normalizedName ? { projectName: normalizedName } : {}),
  };

  return `${JSON.stringify(document, null, 2)}\n`;
}

export function parseProjectFileJson(input: string): ParseProjectFileResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { ok: false, error: 'Invalid JSON file.' };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'Project file root must be an object.' };
  }

  if (parsed.format !== PROJECT_FILE_FORMAT) {
    return { ok: false, error: `Unsupported project format. Expected '${PROJECT_FILE_FORMAT}'.` };
  }

  if (parsed.version !== PROJECT_FILE_VERSION) {
    return { ok: false, error: `Unsupported project version. Expected '${PROJECT_FILE_VERSION}'.` };
  }

  if (typeof parsed.savedAt !== 'string' || !parsed.savedAt.trim()) {
    return { ok: false, error: 'Project file is missing a valid savedAt value.' };
  }

  if (parsed.projectName !== undefined && typeof parsed.projectName !== 'string') {
    return { ok: false, error: 'projectName must be a string when provided.' };
  }

  const state = parsePersistedStudioState(parsed.state);
  if (!state) {
    return { ok: false, error: 'Project state payload is invalid.' };
  }

  return {
    ok: true,
    value: {
      format: PROJECT_FILE_FORMAT,
      version: PROJECT_FILE_VERSION,
      savedAt: parsed.savedAt,
      projectName: typeof parsed.projectName === 'string' ? parsed.projectName : undefined,
      state,
    },
  };
}
