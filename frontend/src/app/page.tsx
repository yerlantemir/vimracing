'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { createRoom } from '@/api/createRoom';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const onCreateRaceClick = async () => {
    const newRoomId = await createRoom();

    router.push(`${newRoomId}/corridor`);
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
