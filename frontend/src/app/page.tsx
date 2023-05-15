'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';

export default function Home() {
  const router = useRouter();

  const onCreateRaceClick = async () => {
    const response = await createRace();
    if (!response) return;

    const { hostToken, raceId } = response;
    LocalStorageManager.setHostToken({
      raceId,
      hostToken
    });
    router.push(raceId);
  };

  return (
    <ContentCard>
      <div className="flex flex-col gap-16">
        <h5 className="font-medium m-0 text-2xl text-gray">
          Vimracing - the global vim competition
        </h5>
        <Button
          style={{ width: '200px' }}
          className="text-gray-3"
          onClick={onCreateRaceClick}
        >
          Create race
        </Button>
      </div>
    </ContentCard>
  );
}
