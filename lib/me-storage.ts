/**
 * Client-only localStorage for "this is me" + the last-seen rank snapshot that
 * powers movement arrows. Versioned so the shape can evolve safely.
 * Never read during SSR/render — only inside effects/handlers.
 */
const KEY = "wc26";

export interface Snapshot {
  asOf: number;
  ranks: Record<string, number>;
}

export interface Store {
  v: 1;
  meName: string | null;
  pickerDismissed: boolean;
  lastSeen: Snapshot | null;
}

const DEFAULT: Store = {
  v: 1,
  meName: null,
  pickerDismissed: false,
  lastSeen: null,
};

export function readStore(): Store {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as Partial<Store>;
    if (parsed?.v !== 1) return { ...DEFAULT };
    return { ...DEFAULT, ...parsed };
  } catch {
    return { ...DEFAULT };
  }
}

export function writeStore(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* private mode / quota — non-fatal */
  }
}

export function setMe(name: string | null): void {
  const store = readStore();
  store.meName = name;
  store.pickerDismissed = true;
  writeStore(store);
}

export function dismissPicker(): void {
  const store = readStore();
  store.pickerDismissed = true;
  writeStore(store);
}

export function saveSnapshot(ranks: Record<string, number>, asOf: number): void {
  const store = readStore();
  store.lastSeen = { ranks, asOf };
  writeStore(store);
}
