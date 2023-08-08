'use client';

import { Editor } from '@/components/Editor';
import { PlayerCard } from '@/components/PlayerCard';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';
import { Recap } from '@/components/pages/race/Recap';
import { ExecutedCommand } from '@vimracing/shared';
import { useState } from 'react';

export default function TestPage() {
  const [executedCommands, setExecutedCommands] = useState<ExecutedCommand[]>(
    []
  );
  const [keysCount, setKeysCount] = useState(0);
  const [currentDoc, setCurrentDoc] = useState<string[]>([
    'function add(a, b) {',
    '  return a + b;',
    '}'
  ]);
  return (
    <div className="flex flex-col gap-4">
      <Recap
        raceDocs={[
          {
            target: [
              'const relPath = filePath.substring(this.path.length + 1);'
            ],
            start: [
              'const relPath = fi2lePath.substring(this.path.length + 1);'
            ],
            source:
              'https://github.com/metarhia/impress/blob/master/lib/place.js#L52'
          },
          {
            target: ['const application = {'],
            start: ['const appli8ation = {'],
            source:
              'https://github.com/metarhia/impress/blob/master/test/api.js#L10'
          },
          {
            start: [
              "var array = ['Element1', 'Element2', 'Element3'];",
              'var anotherArray = [];',
              'for(var i = 0; i < array.length; i++) {',
              '  anotherArray[i] = array[i];',
              '}'
            ],
            target: [
              "var array = ['Element1', 'Element2', 'Element3'];",
              'var anotherArray = array.slice();'
            ]
          },
          {
            start: [
              'let person = {}',
              "person.name = 'John Doe';",
              'person.age = 25;',
              "person.occupation = 'Software Developer';"
            ],
            target: [
              'let person = {',
              "  name: 'John Doe',",
              '  age: 25,',
              "  occupation: 'Software Developer'",
              '}'
            ]
          },
          {
            start: ['function add(a, b) {', '  return a + b;', '}'],
            target: ['const add = (a, b) => {', '  return a + b;', '};']
          }
        ]}
        players={[
          {
            id: '47d1568d-a9e6-43a0-accf-aa708430bf7b',
            username: 'Guest2',
            raceData: {
              completeness: 0,
              currentDocIndex: 0,
              isFinished: false,
              completedDocs: []
            }
          },
          {
            id: '4819216b-4146-4a94-92bc-c8098833fb4d',
            username: 'Yerlan',
            raceData: {
              completeness: 0,
              currentDocIndex: 5,
              completedDocs: [
                {
                  keysCount: 2,
                  seconds: 59,
                  executedCommands: [
                    {
                      isFailed: false,
                      command: 'f2',
                      count: 1
                    }
                  ]
                },
                {
                  keysCount: 3,
                  seconds: 58,
                  executedCommands: [
                    {
                      isFailed: false,
                      command: 'f8',
                      count: 1
                    }
                  ]
                },
                {
                  keysCount: 22,
                  seconds: 54,
                  executedCommands: [
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'w',
                      count: 3
                    },
                    {
                      isFailed: false,
                      command: 'v',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 3
                    }
                  ]
                },
                {
                  keysCount: 55,
                  seconds: 43,
                  executedCommands: [
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'k',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'A',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'V',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 2
                    },
                    {
                      isFailed: true,
                      command: '>',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'df.',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: '.',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: '.',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'k',
                      count: 2
                    },
                    {
                      isFailed: false,
                      command: 'l',
                      count: 4
                    },
                    {
                      isFailed: false,
                      command: 'v',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'l',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'h',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: '.',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'w',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'h',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: '.',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'k',
                      count: 2
                    },
                    {
                      isFailed: false,
                      command: 'A',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'A',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'A',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'o',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'i',
                      count: 1
                    }
                  ]
                },
                {
                  keysCount: 27,
                  seconds: 37,
                  executedCommands: [
                    {
                      isFailed: false,
                      command: 'ciw',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'f(',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'i',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'f)',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'a',
                      count: 1
                    },
                    {
                      isFailed: false,
                      command: 'j',
                      count: 2
                    },
                    {
                      isFailed: false,
                      command: 'a',
                      count: 1
                    }
                  ]
                }
              ],
              isFinished: true,
              place: 1
            }
          }
        ]}
      />
    </div>
  );
}
