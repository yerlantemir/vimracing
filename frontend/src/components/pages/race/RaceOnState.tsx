import Editor from '@/components/Editor';
import { useRef, useEffect } from 'react';
import { Players } from './Players';
import { Player, RaceState } from '@vimracing/shared';

interface RaceOnStateProps {
  raceDoc?: { start: string[]; target: string[] };
  onDocChange: (newDoc: string[]) => void;
  players?: Player[];
  currentPlayer?: Player;
}

export const RaceOnState: React.FC<RaceOnStateProps> = ({
  raceDoc,
  onDocChange,
  players,
  currentPlayer
}) => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !editorParentElement.current ||
      !raceDoc ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;
    new Editor({
      raceDoc,
      parent: editorParentElement.current,
      onChange: onDocChange
    });
  }, [onDocChange, raceDoc]);
  return (
    <>
      <h5 className="text-gray-2">The race is on! Refactor the code below:</h5>
      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {players && currentPlayer && (
        <Players
          raceStatus={RaceState.ON}
          players={players}
          currentPlayer={currentPlayer}
        />
      )}

      <div style={{ height: '0.3px' }} className="bg-gray w-full" />
      {raceDoc && <div ref={editorParentElement} />}
    </>
  );
};
