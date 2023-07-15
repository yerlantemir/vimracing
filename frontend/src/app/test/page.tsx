'use client';

import { ContentCard } from '@/components/ContentCard';
import Editor from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { useEffect, useRef } from 'react';

const TestPage = () => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (
      !editorParentElement.current ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;

    const editor = new Editor({
      raceDoc: {
        start: ['print(hello  world)'],
        target: ['print(hello worldqew)']
      },
      parent: editorParentElement.current,
      onChange: () => {
        console.log('change');
      }
    });
    editor.focus();
    return () => {
      editor?.destroy();
    };
  }, [editorParentElement]);

  return (
    <div>
      <ContentCard>
        <div className="flex flex-col gap-4">
          <div ref={editorParentElement} />

          <Hotkeys />
        </div>
      </ContentCard>
    </div>
  );
};
export default TestPage;
