'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HTMLAttributes, useEffect, useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { Theme } from '@/types/Theme';
import { LocalStorageManager } from '@/utils/storage';

export const Layout = ({ children }: HTMLAttributes<HTMLElement>) => {
  const [theme, setTheme] = useState<Theme>(LocalStorageManager.getTheme());

  useEffect(() => {
    LocalStorageManager.setTheme(theme);
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <ThemeContext.Provider value={{ theme }}>
        <body className="bg-background text-text">
          <div
            className="grow relative"
            style={{
              maxWidth: '75rem'
            }}
          >
            <Header
              currentTheme={theme}
              onThemeChange={(newTheme: Theme) => setTheme(newTheme)}
            />
            {children}
            <Footer />
          </div>
        </body>
      </ThemeContext.Provider>
    </html>
  );
};
