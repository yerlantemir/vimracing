'use client';

import { useState, useRef } from 'react';

const COPIED_INTERNAL_MS = 3000;

type CopyInputProps = {
  link: string;
};

export const CopyInput: React.FC<CopyInputProps> = ({ link = '' }) => {
  const [copied, setCopied] = useState(false);
  const raceInput = useRef<HTMLInputElement | null>(null);

  const onCopyClick = () => {
    if (copied) return;
    console.log('ha?');

    raceInput?.current?.select();
    navigator.clipboard.writeText(raceInput?.current?.value ?? '');

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, COPIED_INTERNAL_MS);
  };

  const onInputClick = (e: any) => {
    console.log(e.target);

    e.target.select();
  };

  return (
    <div
      className="flex justify-between py-1 px-3 pr-0 items-center rounded-xl gap-4 h-10"
      style={{
        background: 'var(--primary-text-2)'
      }}
    >
      <input
        className="border-none outline-none w-full bg-transparent py-2 px-1"
        value={link}
        onClick={onInputClick}
        ref={raceInput}
        readOnly
      />
      <button
        className="border-none rounded py-2 px-4 cursor-pointer w-24 transition duration-300 ease-linear"
        style={{
          color: 'var(--primary-text)',
          background: copied ? 'var(--green-1)' : 'var(--blue-1)'
        }}
        onClick={onCopyClick}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
