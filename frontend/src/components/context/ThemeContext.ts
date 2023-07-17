import { createContext } from 'react';

export type Theme = 'dark' | 'light';

export const ThemeContext = createContext<{ mode: Theme }>({ mode: 'dark' });
