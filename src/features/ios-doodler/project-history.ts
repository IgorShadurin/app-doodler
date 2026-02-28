import {
  clonePersistedStudioState,
  type PersistedStudioState,
} from '@/features/ios-doodler/project-file';

export type ProjectHistoryState = {
  capacity: number;
  past: PersistedStudioState[];
  present: PersistedStudioState;
  future: PersistedStudioState[];
};

type UndoRedoResult =
  | { ok: true; value: ProjectHistoryState }
  | { ok: false; error: string };

const DEFAULT_HISTORY_CAPACITY = 120;

function normalizeCapacity(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_HISTORY_CAPACITY;
  return Math.max(1, Math.round(value));
}

function stateSignature(state: PersistedStudioState): string {
  return JSON.stringify(state);
}

function clonePastOrFuture(states: PersistedStudioState[]): PersistedStudioState[] {
  return states.map((state) => clonePersistedStudioState(state));
}

export function createProjectHistory(
  initial: PersistedStudioState,
  options?: { capacity?: number },
): ProjectHistoryState {
  return {
    capacity: normalizeCapacity(options?.capacity),
    past: [],
    present: clonePersistedStudioState(initial),
    future: [],
  };
}

export function canUndoProjectHistory(history: ProjectHistoryState): boolean {
  return history.past.length > 0;
}

export function canRedoProjectHistory(history: ProjectHistoryState): boolean {
  return history.future.length > 0;
}

export function projectHistoryPush(
  history: ProjectHistoryState,
  nextPresent: PersistedStudioState,
): ProjectHistoryState {
  const next = clonePersistedStudioState(nextPresent);
  if (stateSignature(next) === stateSignature(history.present)) {
    return history;
  }

  const nextPast = [...clonePastOrFuture(history.past), clonePersistedStudioState(history.present)];
  const overflow = Math.max(0, nextPast.length - history.capacity);
  const boundedPast = overflow > 0 ? nextPast.slice(overflow) : nextPast;

  return {
    capacity: history.capacity,
    past: boundedPast,
    present: next,
    future: [],
  };
}

export function projectHistoryUndo(history: ProjectHistoryState): UndoRedoResult {
  if (history.past.length < 1) {
    return { ok: false, error: 'Nothing to undo.' };
  }

  const nextPast = clonePastOrFuture(history.past);
  const previous = nextPast.pop();
  if (!previous) {
    return { ok: false, error: 'Nothing to undo.' };
  }

  const nextFuture = [clonePersistedStudioState(history.present), ...clonePastOrFuture(history.future)];

  return {
    ok: true,
    value: {
      capacity: history.capacity,
      past: nextPast,
      present: previous,
      future: nextFuture,
    },
  };
}

export function projectHistoryRedo(history: ProjectHistoryState): UndoRedoResult {
  if (history.future.length < 1) {
    return { ok: false, error: 'Nothing to redo.' };
  }

  const nextFuture = clonePastOrFuture(history.future);
  const nextPresent = nextFuture.shift();
  if (!nextPresent) {
    return { ok: false, error: 'Nothing to redo.' };
  }

  const nextPast = [...clonePastOrFuture(history.past), clonePersistedStudioState(history.present)];
  const overflow = Math.max(0, nextPast.length - history.capacity);
  const boundedPast = overflow > 0 ? nextPast.slice(overflow) : nextPast;

  return {
    ok: true,
    value: {
      capacity: history.capacity,
      past: boundedPast,
      present: nextPresent,
      future: nextFuture,
    },
  };
}
