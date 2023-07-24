'use client';

import { Editor } from '@/components/Editor';

export default function TestPage() {
  return (
    <div>
      <Editor
        raceDoc={{
          start: [
            `static updateB(chunks: readonly Chunk[]) {`,
            `  return updateChunks(findRangesForChange(chunks, changes, false, a.length), chunks, a, b)`,
            `}`
          ],
          target: [`static updateB(chunks: readonly Chunk[]) {`, `}`]
        }}
      />
    </div>
  );
}
