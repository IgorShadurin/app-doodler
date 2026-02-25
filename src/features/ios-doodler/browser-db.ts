import type { TemplateSlot } from '@/features/ios-doodler/model';

export type IosDoodlerPersistedState = {
  slots: TemplateSlot[];
  enabledLanguages: string[];
  activeLanguageCode: string;
  favoriteFonts: string[];
};

type IosDoodlerStateRecord = {
  id: 'state';
  payload: IosDoodlerPersistedState;
  updatedAt: number;
};

const DB_NAME = 'ios-doodler-browser-db';
const DB_VERSION = 1;
const STORE_NAME = 'studio_state';
const STATE_KEY: IosDoodlerStateRecord['id'] = 'state';

function getIndexedDbFactory(): IDBFactory | null {
  if (typeof window === 'undefined') return null;
  return window.indexedDB ?? null;
}

function openIosDoodlerDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve, reject) => {
    const factory = getIndexedDbFactory();
    if (!factory) {
      resolve(null);
      return;
    }

    const request = factory.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open iOS Doodler browser DB.'));
  });
}

export async function loadIosDoodlerState(): Promise<IosDoodlerPersistedState | null> {
  const database = await openIosDoodlerDb();
  if (!database) return null;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STATE_KEY);

    request.onsuccess = () => {
      const record = request.result as IosDoodlerStateRecord | undefined;
      resolve(record?.payload ?? null);
    };
    request.onerror = () => reject(request.error ?? new Error('Failed to load iOS Doodler state.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to read iOS Doodler state.'));
    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function saveIosDoodlerState(payload: IosDoodlerPersistedState): Promise<void> {
  const database = await openIosDoodlerDb();
  if (!database) return;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({
      id: STATE_KEY,
      payload,
      updatedAt: Date.now(),
    } as IosDoodlerStateRecord);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to save iOS Doodler state.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to save iOS Doodler state.'));
  });
}

export async function clearIosDoodlerState(): Promise<void> {
  const database = await openIosDoodlerDb();
  if (!database) return;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to clear iOS Doodler state.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to clear iOS Doodler state.'));
  });
}
