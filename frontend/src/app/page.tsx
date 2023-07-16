'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { useTraining } from '@/hooks/useTraining';

type SupportedLangs = 'js' | 'python';
const supportedLangs: SupportedLangs[] = ['js', 'python'];
export default function Home() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<'js' | 'python'>('js');
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const { raceData } = useTraining({ selectedLang });
  const [documentIndex, setDocumentIndex] = useState<number>(0);

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

  const onDocChange = useCallback(
    (newDoc: string[]) => {
      if (
        raceData &&
        newDoc.join('') === raceData[documentIndex].target.join('')
      ) {
        setDocumentIndex((prev) => prev + 1);
      }
    },
    [documentIndex, raceData]
  );

  useEffect(() => {
    if (
      !editorParentElement.current ||
      !raceData ||
      !raceData[documentIndex] ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    const editor = new Editor({
      raceDoc: raceData[documentIndex],
      parent: editorParentElement.current,
      onChange: onDocChange
    });
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, [documentIndex, onDocChange, raceData]);

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
          <Hotkeys key={documentIndex} />
        </div>
      </ContentCard>
    </>
  );
}
