'use client';

import { ContentCard } from '@/components/ContentCard';
import Editor from '@/components/Editor';
import { UserCard } from '@/components/UserCard';
import { useRace } from '@/hooks/useRace';
import { useEffect, useRef } from 'react';

export default function RacePage({ params }: { params: { raceId: string } }) {
  const { raceId } = params;
  const { raceDoc, currentUser, onDocChange } = useRace(raceId);
  const editorParentElement = useRef<HTMLDivElement | null>(null);
  const usersPayload = [
    {
      id: 1,
      username: 'firts-user',
      completeness: 0.5
    },
    {
      id: 2,
      username: 'second',
      completeness: 0.6
    },
    {
      id: 3,
      username: 'three',
      completeness: 0.7
    },
    {
      id: 4,
      username: '4k',
      completeness: 0.8
    }
  ];

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
    return (
      <div className="flex flex-col gap-3 justify-center grow">
        {usersPayload.map(({ id, username, completeness }, index) => {
          return (
            <UserCard
              key={id}
              username={username}
              completeness={completeness}
              place={index + 1}
              isCurrentUser={index === 0}
            />
          );
        })}
      </div>
    );
  };

  return (
    <ContentCard>
      <div className="flex flex-col gap-4">
        <h5 className="text-gray-2">
          The race is on! Refactor the code below:
        </h5>
        <div
          style={{ height: '0.3px', width: '100%', background: ' #abb2bf' }}
        />
        {renderUsers()}

        <div
          style={{ height: '0.3px', width: '100%', background: ' #abb2bf' }}
        />
        {raceDoc && <div ref={editorParentElement} />}
      </div>
    </ContentCard>
  );
}
