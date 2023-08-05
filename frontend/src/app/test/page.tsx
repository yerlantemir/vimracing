'use client';

import { Editor } from '@/components/Editor';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { ExecutedCommand } from '@vimracing/shared';
import { useState } from 'react';

export default function TestPage() {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>(
    []
  );
  const [keysCount, setKeysCount] = useState(0);
  return (
    <div>
      <Editor
        raceDoc={{
          start: ['abcdefghijklmnopqrstuvwxyz', ''],
          target: ['zyxwvutsrqponmlkjihgfedcba', ''],
          source: 'kek'
        }}
      />
      <Hotkeys
        executedCommands={executedCommands}
        setExecutedCommands={setExecutedCommands}
        keysCount={keysCount}
        onKeyPressed={() => setKeysCount((prev) => prev + 1)}
      />
    </div>
  );
}
