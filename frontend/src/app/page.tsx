'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRace } from '@/api/createRace';
import { useRouter } from 'next/navigation';
import { LocalStorageManager } from '@/utils/storage';
import { Loading } from '@/components/Loading';

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
        <h5 className="font-medium m-0 text-base text-text">
          vimracing - Compete with Your Friends in Vim Mastery
        </h5>
        <Loading loading={false}>
          <Button
            style={{ width: '120px' }}
            className="text-text"
            onClick={onCreateRaceClick}
          >
            Create a race
          </Button>
        </Loading>
      </div>
    </ContentCard>
  );
}
