'use client';

import { Button } from '@/components/Button';
import { ContentCard } from '@/components/ContentCard';
import { CopyInput } from '@/components/CopyInput';
import Editor from '@/components/Editor';
import { PlayerCard } from '@/components/PlayerCard';
import { useRace } from '@/hooks/useRace';
import { Player, RaceState } from '@vimracing/shared';
import { useEffect, useRef } from 'react';

export default function RacePage({ params }: { params: { raceId: string } }) {
  const { raceId } = params;
  const {
    players,
    raceStatus,
    raceDoc,
    currentPlayer,
    onDocChange,
    isHost,
    onHostRaceStartClick
  } = useRace(raceId);
  const editorParentElement = useRef<HTMLDivElement | null>(null);

  const allPlayers = [currentPlayer, ...(players ?? [])].filter(
    (a): a is Player => !!a
  );
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

  const renderPlayers = () => {
    if (!players || !currentPlayer) return null;

    const currentPlayerPlace =
      allPlayers
        ?.sort((a, b) => (b.completeness ?? 0) - (a.completeness ?? 0))
        ?.findIndex((user) => user.id === currentPlayer?.id) + 1;

    return (
      <div className="flex gap-4">
        <div
          className="flex flex-col gap-3 grow justify-start overflow-y-scroll"
          style={{ maxHeight: '120px' }}
        >
          {allPlayers.map(({ id, username, completeness }, index) => {
            return (
              <PlayerCard
                key={id}
                username={username}
                completeness={completeness ?? 0}
                isCurrentUser={index === 0}
                raceStatus={raceStatus}
              />
            );
          })}
        </div>
        {raceStatus !== RaceState.WAITING && (
          <>
            <div
              style={{
                width: '0.3px'
              }}
              className="bg-gray"
            />
            <div
              style={{
                width: '20%',
                fontSize: '64px',
                lineHeight: '100%'
              }}
              className="text-white items-center text-center m-auto"
            >
              {currentPlayerPlace}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderRaceByStatus = () => {
    switch (raceStatus) {
      case RaceState.WAITING:
        return (
          <>
            <h5 className="text-gray-2">Share the link below</h5>
            <CopyInput link="https://vimracing.com/race/${this.raceId}" />
            <div style={{ height: '0.3px' }} className="bg-gray w-full" />
            {renderPlayers()}

            <div style={{ height: '0.3px' }} className="bg-gray w-full" />
            {isHost && (
              <Button
                onClick={onHostRaceStartClick}
                className="text-gray-3"
                style={{ maxWidth: '200px' }}
              >
                Start the race!
              </Button>
            )}
          </>
        );
      case RaceState.ON:
        return (
          <>
            <h5 className="text-gray-2">
              The race is on! Refactor the code below:
            </h5>
            <div style={{ height: '0.3px' }} className="bg-gray w-full" />
            {renderPlayers()}

            <div style={{ height: '0.3px' }} className="bg-gray w-full" />
            {raceDoc && <div ref={editorParentElement} />}
          </>
        );
      case RaceState.FINISHED:
        return <div>finished</div>;
    }
  };
  return (
    <ContentCard>
      <div className="flex flex-col gap-4">{renderRaceByStatus()}</div>
    </ContentCard>
  );
}
