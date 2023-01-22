export enum CacheStorageKey {
  UserId = 'userId'
}

export class CacheStorage {
  public static get(key: CacheStorageKey) {
    return localStorage.getItem(key);
  }
  public static set(key: CacheStorageKey, value: string) {
    localStorage.setItem(key, value);
  }
}
