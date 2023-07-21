'use client';

import Link from 'next/link';
import { GithubIcon, SunIcon } from './icons';
import { useRouter } from 'next/navigation';
import { MoonIcon } from './icons/MoonIcon';
import { Theme } from '@/types/Theme';

export const Header = ({
  currentTheme,
  onThemeChange
}: {
  onThemeChange: (newTheme: Theme) => void;
  currentTheme: Theme;
}) => {
  const router = useRouter();
  const onHeaderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/');
  };

  const iconClassNames =
    'text-gray hover:text-text transition duration-200 cursor-pointer outline-1 h-5 w-5';

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-xl">
        <Link
          className="no-underline text-text"
          href="/"
          onClick={onHeaderClick}
        >
          vimracing
        </Link>
      </h1>

      <div className="flex items-center gap-4 text-text">
        {currentTheme === 'dark' ? (
          <SunIcon
            className={iconClassNames}
            tabIndex={0}
            onClick={() => onThemeChange('light')}
          />
        ) : (
          <MoonIcon
            className={iconClassNames}
            tabIndex={0}
            onClick={() => onThemeChange('dark')}
          />
        )}
        <a href="https://github.com/yerlantemir/vimracing" target="_blank">
          <GithubIcon className={iconClassNames} tabIndex={0} />
        </a>
      </div>
    </div>
  );
};
