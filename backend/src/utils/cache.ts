type Entry<T> = { value: T; expiresAt: number };

export class TtlCache {
  private readonly entries = new Map<string, Entry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) { this.entries.delete(key); return undefined; }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number) { this.entries.set(key, { value, expiresAt: Date.now() + ttlMs }); return value; }
  clear() { this.entries.clear(); }
}

export const businessCache = new TtlCache();
