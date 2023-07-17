import { Layout } from '@/components/Layout';
import './globals.css';
import { HTMLAttributes } from 'react';

export const metadata = {
  title: 'vimracing',
  description: 'Vimracing is a website for racing in vim'
};

export default function RootLayout({ children }: HTMLAttributes<HTMLElement>) {
  return <Layout>{children}</Layout>;
}
