'use client';

import Link from 'next/link';
import { Github, Sun } from './icons';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const onHeaderClick = (e: any) => {
    e.preventDefault();
    router.push('/');
    // TODO: route to '/'
  };

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-3xl">
        <Link
          style={{
            color: 'var(--primary-text)'
          }}
          className="no-underline"
          href="/"
          onClick={onHeaderClick}
        >
          Vimracing
        </Link>
      </h1>

      <div
        className="flex items-center gap-4"
        style={{ color: 'var(--primary-text)' }}
      >
        <Sun /> <Github />
      </div>
    </div>
  );
};
