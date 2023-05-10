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
    if (!editorParentElement.current || !raceDoc) return;
    new Editor({
      onChange: onDocChange,
      parent: editorParentElement.current,
      raceDoc
    });
  }, [onDocChange, raceDoc]);

  const renderUsers = () => {
    if (!usersPayload) return null;
    return (
      <div className="flex flex-col gap-3 justify-center items-center">
        {usersPayload
          .sort((a, b) => b.completeness - a.completeness)
          .map(({ id, username, completeness }, index) => {
            return (
              <UserCard
                key={id}
                username={username}
                completeness={completeness}
                place={index + 1}
              />
            );
          })}
      </div>
    );
  };

  return (
    <ContentCard>
      <div className="flex flex-col gap-4">
        <h5>The race is on! Refactor the code below:</h5>
        {renderUsers()}
        {raceDoc && <div ref={editorParentElement} />}
      </div>
    </ContentCard>
  );
}
