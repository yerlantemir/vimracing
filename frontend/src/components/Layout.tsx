'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HTMLAttributes, useState } from 'react';
import { Theme, ThemeContext } from './context/ThemeContext';

export const Layout = ({ children }: HTMLAttributes<HTMLElement>) => {
  const [theme, setTheme] = useState<Theme>('dark');

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
