'use client';

import { Editor } from '@/components/Editor';

export default function TestPage() {
  return (
    <div>
      <Editor
        raceDoc={{
          start: ['abcdefghijklmnopqrstuvwxyz', ''],
          target: ['zyxwvutsrqponmlkjihgfedcba', ''],
          source: 'kek'
        }}
      />
    </div>
  );
}
