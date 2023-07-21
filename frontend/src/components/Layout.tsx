'use client';

import { Header } from '@/components/Header';
import { HTMLAttributes, useEffect, useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { Theme } from '@/types/Theme';
import { Footer } from './Footer';
import { LocalStorageManager } from '@/utils/storage';

type Props = HTMLAttributes<HTMLElement>;
export const ThemeLayout = ({ children }: Props) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  const onThemeChange = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setCurrentTheme(newTheme);
    LocalStorageManager.setTheme(newTheme);
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      const theme = LocalStorageManager.getTheme();
      if (theme) {
        onThemeChange(theme);
      }
      setMounted(true);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme }}>
      <div
        className="grow relative"
        style={{
          maxWidth: '75rem'
        }}
      >
        <Header currentTheme={currentTheme} onThemeChange={onThemeChange} />
        {children}

        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};
