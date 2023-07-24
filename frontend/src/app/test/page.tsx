'use client';

import { Editor } from '@/components/Editor';

export default function TestPage() {
  return (
    <div>
      <Editor
        raceDoc={{
          target: [
            `return upateChunks(findRangesForChange(chunks, changes, false, a.length), chunks, a, b)`,
            `}`
          ],
          start: [
            `return updateChun(findRangesForChange(chunks, changes, false, a.length), chunks, a, b)`,
            `}`
          ]
        }}
        unified={false}
      />
    </div>
  );
}
