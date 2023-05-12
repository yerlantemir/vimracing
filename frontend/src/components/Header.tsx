'use client';

import { Github, Sun } from './icons';

export const Header = () => {
  const onHeaderClick = (e: any) => {
    e.preventDefault();
    // TODO: route to '/'
  };

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-3xl">
        <a
          style={{
            color: 'var(--primary-text)'
          }}
          className="no-underline"
          href="https://vimracing.com"
          onClick={onHeaderClick}
        >
          Vimracing
        </a>
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
