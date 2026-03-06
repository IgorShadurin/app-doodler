import type { TemplateSlot } from '@/features/app-doodler/model';

export type AppDoodlerPersistedState = {
  slots: TemplateSlot[];
  enabledLanguages: string[];
  activeLanguageCode: string;
  favoriteFonts: string[];
};

type AppDoodlerStateRecord = {
  id: 'state';
  payload: AppDoodlerPersistedState;
  updatedAt: number;
};

const DB_NAME = 'app-doodler-browser-db';
const DB_VERSION = 1;
const STORE_NAME = 'studio_state';
const STATE_KEY: AppDoodlerStateRecord['id'] = 'state';

function getIndexedDbFactory(): IDBFactory | null {
  if (typeof window === 'undefined') return null;
  return window.indexedDB ?? null;
}

function openAppDoodlerDb(): Promise<IDBDatabase | null> {
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
    request.onerror = () => reject(request.error ?? new Error('Failed to open App Doodler browser DB.'));
  });
}

export async function loadAppDoodlerState(): Promise<AppDoodlerPersistedState | null> {
  const database = await openAppDoodlerDb();
  if (!database) return null;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STATE_KEY);

    request.onsuccess = () => {
      const record = request.result as AppDoodlerStateRecord | undefined;
      resolve(record?.payload ?? null);
    };
    request.onerror = () => reject(request.error ?? new Error('Failed to load App Doodler state.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to read App Doodler state.'));
    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function saveAppDoodlerState(payload: AppDoodlerPersistedState): Promise<void> {
  const database = await openAppDoodlerDb();
  if (!database) return;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({
      id: STATE_KEY,
      payload,
      updatedAt: Date.now(),
    } as AppDoodlerStateRecord);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to save App Doodler state.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to save App Doodler state.'));
  });
}

export async function clearAppDoodlerState(): Promise<void> {
  const database = await openAppDoodlerDb();
  if (!database) return;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onabort = () => reject(transaction.error ?? new Error('Failed to clear App Doodler state.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to clear App Doodler state.'));
  });
}
