export enum CacheStorageKey {
  User = 'user'
}

export class CacheStorage {
  public static getUser(): { id: string; username: string } | null {
    const userPayload = localStorage.getItem(CacheStorageKey.User);
    if (!userPayload) return null;

    return JSON.parse(userPayload);
  }
  public static setUser({ id, username }: { id: string; username: string }) {
    localStorage.setItem(
      CacheStorageKey.User,
      JSON.stringify({ id, username })
    );
  }
}
