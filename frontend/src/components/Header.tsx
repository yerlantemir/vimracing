'use client';

import Link from 'next/link';
import { Github, Sun } from './icons';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const onHeaderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/');
  };

  const iconClassNames =
    'text-gray hover:text-gray-2 transition duration-200 cursor-pointer outline-1';

  return (
    <div className="flex justify-between items-center h-20">
      <h1 className="text-2xl">
        <Link
          className="no-underline text-gray"
          href="/"
          onClick={onHeaderClick}
        >
          vimracing
        </Link>
      </h1>

      <div className="flex items-center gap-4 text-gray">
        <Sun className={iconClassNames} tabIndex={0} />{' '}
        <Github className={iconClassNames} tabIndex={0} />
      </div>
    </div>
  );
};
