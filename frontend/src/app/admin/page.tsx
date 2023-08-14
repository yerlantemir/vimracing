'use client';

import { addRaceByAdmin } from '@/api/addRaceByAdmin';
import { Button } from '@/components/Button';
import { Editor } from '@/components/Editor';
import { LoadingIcon } from '@/components/Loading';
import { RaceDocs } from '@vimracing/shared';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const startingRaceData = {
  start: ['hello'],
  target: ['hello']
};

const MemoEditor = memo(function MemoizedEditor({
  startDoc,
  onDocChange,
  onTargetDocChange
}: {
  startDoc: RaceDocs[number];
  onDocChange: (newDoc: string[]) => void;
  onTargetDocChange: (newDoc: string[]) => void;
}) {
  return (
    <Editor
      raceDoc={startDoc}
      isCreatingRace={true}
      onChange={onDocChange}
      onTargetDocChange={onTargetDocChange}
    />
  );
});

export default function AdminPage() {
  const [raceData, setRaceData] = useState<RaceDocs>([{ ...startingRaceData }]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [currentRaceData, setCurrentRaceData] = useState<RaceDocs[number]>(
    raceData[currentDocIndex]
  );
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onDocChange = useCallback(
    (newDoc: string[]) => {
      setRaceData((prev) => {
        return prev.map((arr, index) => {
          if (index === currentDocIndex) return { ...arr, start: newDoc };
          return arr;
        });
      });
    },
    [currentDocIndex]
  );

  const onTargetDocChange = useCallback(
    (newDoc: string[]) => {
      setRaceData((prev) => {
        return prev.map((arr, index) => {
          if (index === currentDocIndex) return { ...arr, target: newDoc };
          return arr;
        });
      });
    },
    [currentDocIndex]
  );

  const onSubmit = () => {
    setLoading(true);
    addRaceByAdmin(raceData, password)
      .then(() => {
        setCurrentDocIndex(0);
        setRaceData;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRightArrowClick = () => {
    if (!raceData[currentDocIndex + 1])
      setRaceData((prev) => [...prev, { ...startingRaceData }]);
    setCurrentDocIndex((prev) => prev + 1);
  };
  const onLeftArrowClick = () => {
    setCurrentDocIndex((prev) => prev - 1);
  };

  const docIndexRef = useRef(0);
  useEffect(() => {
    if (docIndexRef.current !== currentDocIndex) {
      docIndexRef.current = currentDocIndex;
      setCurrentRaceData(raceData[currentDocIndex]);
    }
  }, [currentDocIndex, raceData]);

  return (
    <div className="text-text flex flex-col gap-4">
      <span className="text-xl">{currentDocIndex + 1}/5</span>
      <div className="flex gap-2">
        <Button onClick={onLeftArrowClick}>{'<'}</Button>
        <div className="flex-grow">
          <MemoEditor
            startDoc={currentRaceData}
            onDocChange={onDocChange}
            onTargetDocChange={onTargetDocChange}
          />
        </div>
        <Button onClick={onRightArrowClick}>{'>'}</Button>
      </div>
      password
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      {loading ? <LoadingIcon /> : <Button onClick={onSubmit}>submit</Button>}
    </div>
  );
}
