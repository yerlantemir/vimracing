'use client';

import { ContentCard } from '@/components/ContentCard';
import Editor from '@/components/Editor';
import { UserCard } from '@/components/UserCard';
import { useRace } from '@/hooks/useRace';
import { useEffect, useRef } from 'react';

export default function RacePage({ params }: { params: { raceId: string } }) {
  const { raceId } = params;
  const { usersPayload, raceDoc, currentUser, onDocChange } = useRace(raceId);
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

  const renderUsers = () => {
    if (!usersPayload) return null;

    const currentUserPlace =
      usersPayload
        ?.sort((a, b) => b.completeness - a.completeness)
        ?.findIndex((user) => user.id === currentUser?.id) + 1;

    return (
      <div className="flex gap-4">
        <div
          className="flex flex-col gap-3 grow justify-start overflow-y-scroll"
          style={{ maxHeight: '120px' }}
        >
          {usersPayload.map(({ id, username, completeness }, index) => {
            return (
              <UserCard
                key={id}
                username={username}
                completeness={completeness}
                isCurrentUser={index === 0}
              />
            );
          })}
        </div>
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
          {currentUserPlace}
        </div>
      </div>
    );
  };

  return (
    <ContentCard>
      <div className="flex flex-col gap-4">
        <h5 className="text-gray-2">
          The race is on! Refactor the code below:
        </h5>
        <div style={{ height: '0.3px' }} className="bg-gray w-full" />
        {renderUsers()}

        <div style={{ height: '0.3px' }} className="bg-gray w-full" />
        {raceDoc && <div ref={editorParentElement} />}
      </div>
    </ContentCard>
  );
}
