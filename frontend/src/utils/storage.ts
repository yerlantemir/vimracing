'use client';

import { Theme } from '@/types/Theme';

export enum CacheStorageKey {
  User = 'user',
  HostToken = 'hostToken',
  Theme = 'theme'
}

export class LocalStorageManager {
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
  public static setHostToken({
    raceId,
    hostToken
  }: {
    raceId: string;
    hostToken: string;
  }) {
    localStorage.setItem(
      CacheStorageKey.HostToken,
      `${raceId}DELIMETER${hostToken}`
    );
  }
  public static getHostToken(): {
    raceId: string;
    hostToken: string;
  } | null {
    const token = localStorage.getItem(CacheStorageKey.HostToken);
    if (!token) return null;
    const [raceId, hostToken] = token.split('DELIMETER');
    return { raceId, hostToken };
  }

  public static setTheme(theme: Theme) {
    localStorage.setItem(CacheStorageKey.Theme, theme);
  }

  public static getTheme(): Theme {
    const theme = localStorage.getItem(CacheStorageKey.Theme);
    if (!theme) return 'dark';
    return theme as Theme;
  }
}
