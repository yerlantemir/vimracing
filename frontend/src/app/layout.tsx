import './globals.css';
import { HTMLAttributes } from 'react';
import { ThemeLayout } from '@/components/Layout';

export const metadata = {
  title: 'vimracing',
  description: 'Vimracing is a website for racing in vim'
};

export default function Layout({ children }: HTMLAttributes<HTMLElement>) {
  return (
    <html lang="en">
      <body className="bg-background text-text">
        <ThemeLayout>{children}</ThemeLayout>
      </body>
    </html>
  );
}
