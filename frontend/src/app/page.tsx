'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { useTraining } from '@/hooks/useTraining';
import { SupportedLanguages } from '@vimracing/shared';

export default function Home() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguages>(
    SupportedLanguages.js
  );
  const [documentIndex, setDocumentIndex] = useState<number>(0);
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const { raceData, fillRaceData } = useTraining({ selectedLang });

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
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    if (!raceData[documentIndex]) {
      setDocumentIndex(0);
      fillRaceData();
      return;
    }
    const editor = new Editor({
      raceDoc: raceData[documentIndex],
      parent: editorParentElement.current,
      onChange: onDocChange
    });
    editor.focus();

    return () => {
      editor?.destroy();
    };
  }, [documentIndex, fillRaceData, onDocChange, raceData]);

  return (
    <>
      <div
        className="bg-secondary py-1 px-3 gap-6 flex rounded-xl items-center text-xs m-auto"
        style={{ width: 'fit-content' }}
      >
        {Object.keys(SupportedLanguages).map((a) => (
          <p
            key={a}
            className={`${
              a === selectedLang ? 'text-primary' : ''
            } cursor-pointer transition duration-300`}
            onClick={() => setSelectedLang(a as SupportedLanguages)}
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
