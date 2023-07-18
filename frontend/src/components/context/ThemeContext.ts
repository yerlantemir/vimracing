import { Theme } from '@/types/Theme';
import { createContext } from 'react';

export const ThemeContext = createContext<{ theme: Theme }>({ theme: 'dark' });
