'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { useEffect, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';

const supportedLangs = ['js', 'python'];
export default function Home() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('js');
  const editorParentElement = useRef<HTMLDivElement | null>(null);

  const onCreateRaceClick = async () => {
    const response = await createRace();
    if (!response) return;

    const { hostToken, raceId } = response;
    LocalStorageManager.setHostToken({
      raceId,
      hostToken
    });
    router.push(raceId);
  };

  useEffect(() => {
    if (
      !editorParentElement.current ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    const editor = new Editor({
      raceDoc: {
        start: ['console.log("hell worldd")'],
        target: ['console.log("hello world")']
      },
      parent: editorParentElement.current
    });
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, []);

  return (
    <>
      <div
        className="bg-secondary py-1 px-3 gap-6 flex rounded-xl items-center text-xs m-auto"
        style={{ width: 'fit-content' }}
      >
        {supportedLangs.map((a) => (
          <p
            key={a}
            className={`${
              a === selectedLang ? 'text-primary' : ''
            } cursor-pointer transition duration-300`}
            onClick={() => setSelectedLang(a)}
          >
            {a}
          </p>
        ))}
        |<Button onClick={onCreateRaceClick}>compete</Button>
      </div>
      <ContentCard style={{ paddingTop: '6rem' }}>
        <div className="flex flex-col gap-4">
          <div ref={editorParentElement} />
          <Hotkeys />
        </div>
      </ContentCard>
    </>
  );
}
